import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { getFirstAction, setFirstAction } from '../utils/AsyncStorageModule';
import { connect } from 'react-redux';
import validator from '../utils/validator';
import { 
    loginSuccess,
    loginError,
    login,
    redirectToAuthFailureScreen,
    navigateBack,
    redirectToInitializeScreen 
} from '../reducers/authentification/authActions';
import QRScannerComponent from '../components/QRScannerComponent';
import StorjLib from '../utils/StorjModule';
import SyncModule from '../utils/SyncModule';
import { LoginStateModel } from '../models/LoginStateModel';
import infoScreensConstants from '../utils/constants/infoScreensConstants';
 
const FIRST_ACTION = 'FIRST_ACTION';

/**
 * Container for QRCodeScannerComponent
 */
class QRScannerContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewAppear: true
        };

        this.releaseTimer = null;
        this.stateModel = new LoginStateModel();
    }

    /**
     * Handle if was already in use
     */
    handleFirstLaunch = async (email) => {
        if(!await getFirstAction()) {
            await setFirstAction();
        }

        SyncModule.insertSyncSetting(email);
    };

    /**
     * try validate credentials and invokes actionCreators  
     * to change userInfo in store
     */
	tryLogin = async () => {
        let isEmailValid = validator.isEmail(this.stateModel.email);
        let isPasswordValid = this.stateModel.password ? true : false;
        let isMnemonicValid = await StorjLib.checkMnemonic(this.stateModel.mnemonic);

        if(isEmailValid && isPasswordValid && isMnemonicValid) {
            await this.login();
        } else {
            this._barComponent.setBorderColor('#EB5757');
            this.releaseTimer = setTimeout(() => {this._startScan();}, 1500); 
            console.log('onError');
        }
    };

    /**
     * validating data on server and try login into Storj
     */
    login = async () => {
        this.props.login(
            this.stateModel.email, 
            this.stateModel.password,
            this.stateModel.mnemonic
        );

        let areCredentialsValid = await StorjLib.verifyKeys(
            this.stateModel.email, 
            this.stateModel.password);

        if(!areCredentialsValid) {
            this.props.loginError();
            this.props.redirectToAuthFailureScreen({
                mainText: infoScreensConstants.loginFailureMainText, 
                additionalText: infoScreensConstants.loginFailureAdditionalText 
            });

            this._barComponent.setBorderColor('#EB5757');
            this.releaseTimer = setTimeout(() => {this._startScan();}, 1500); 
            return;
        }

        let areKeysImported = await StorjLib.importKeys(
            this.stateModel.email,
            this.stateModel.password,
            this.stateModel.mnemonic,
            ''
        );
        
        if(areKeysImported) {
            await this.handleFirstLaunch(this.stateModel.email);
            this.props.loginSuccess();
            this.props.redirectToInitializeScreen();
        } else {
            this._barComponent.setBorderColor('#EB5757');
            this.releaseTimer = setTimeout(() => {this._startScan();}, 1500); 
            this.props.loginError();
            this.props.redirectToAuthFailureScreen({ 
                mainText: infoScreensConstants.loginFailureMainText, 
                additionalText: infoScreensConstants.loginFailureAdditionalText 
            });
        }
    };

    /**
     * Function that triggers when some barcode was read
     */
    _onBarCodeRead = (e) => {
        this._stopScan();
        
        try {
            const result = JSON.parse(e.nativeEvent.data.code);
            if(result.email && result.password && result.mnemonic) {
                this._barComponent.setBorderColor('#27AE60');

                this.stateModel.email = result.email;
                this.stateModel.password = result.password;
                this.stateModel.mnemonic = result.mnemonic;
                
                this.tryLogin();
            } 
            else { 
                this._barComponent.setBorderColor('#EB5757');
                this.releaseTimer = setTimeout(() => {this._startScan();}, 1500); 
            }
        }
        catch(error) {
            console.log(error);
            this._barComponent.setBorderColor('#EB5757');
            this.releaseTimer = setTimeout(() => {this._startScan();}, 1500);
        }
    }

    /**
     * Functions that starting and stopping scanning action in QRScannerComponent
     */
    _startScan = (e) => {
        clearTimeout(this.releaseTimer);
        this._barComponent.setBorderColor('white');
        this._barComponent._barCode.startScan();
    }
    _stopScan = (e) => {
        this._barComponent._barCode.stopScan();
    }

    /**
     * Redirecting on previous page
     */
    navigateBack = () => {
        this.props.navigateBack();
    }

    render() {
        return (
            <QRScannerComponent
                ref = { component => this._barComponent = component }
                viewAppear = { this.state.viewAppear }
                navigateBack = { this.navigateBack.bind(this) }
                onBarCodeRead = { this._onBarCodeRead } />
        )
    }  
}

    

/**
 * connecting reducer to component props 
 */
function mapStateToProps(state) { return { user: state.authReducer.user }; };
function mapDispatchToProps(dispatch) { 
    return {
        ...bindActionCreators({
            loginSuccess,
            loginError,
            login,
            redirectToAuthFailureScreen,
            navigateBack,
            redirectToInitializeScreen}, dispatch) 
    }
};

/**
 * Creating QRCodeScannerScreen container
 */
export default connect(mapStateToProps, mapDispatchToProps)(QRScannerContainer);
