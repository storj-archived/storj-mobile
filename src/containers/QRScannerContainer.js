import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import validator from '../utils/validator';
import { qrScannerActionCreators } from '../reducers/authentification/authActions';
import QRScannerComponent from '../components/QRScannerComponent';
import StorjLib from '../utils/StorjModule';
import { LoginStateModel } from '../models/LoginStateModel';
import infoScreensConstants from '../utils/constants/infoScreensConstants';
 
const FIRST_ACTION = 'FIRST_ACTION';

/**
 * Redux container for QRCodeScannerComponent
 */
class QRScannerContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewAppear: true,
            layout: ''
        };

        this.stateModel = new LoginStateModel();
    }

    componentDidMount() {
        let viewAppearCallBack = (event) => {
            this.setTimeout( () => {
                this.setState({
                    viewAppear: true,
                    layout: 'scanning'
                })
            }, 255);
        };
    }

    /**
     * Handle if was allready in use
     */
    handleFirstLaunch = async () => {
        if(!await AsyncStorage.getItem(FIRST_ACTION)) {
            await AsyncStorage.setItem(FIRST_ACTION, 'true');
        }
    };

    /**
     * try validate login as email and invokes actionCreators  
     * to change userInfo in store
     */
	tryLogin = async () => {
        console.log('trylogin');
        console.log(this.state);
        console.log(this.stateModel);
        if(!this.state.layout === 'error' || !this.state.layout === 'scanning') return;
        this.setState({ layout: 'success' });

        let isEmailValid = validator.isEmail(this.stateModel.email);
        let isPasswordValid = this.stateModel.password ? true : false;
        let isMnemonicValid = await StorjLib.checkMnemonic(this.stateModel.mnemonic);

        if(isEmailValid && isPasswordValid && isMnemonicValid) {
            await this.login();
        } else {
            console.log('onError');
        }

        this.setState({ layout: 'scanning' });
    };

    /**
     * validating data on server and try login into storj
     */
    login = async () => {
        console.log('login');
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

            return;
        }

        let areKeysImported = await StorjLib.importKeys(
            this.stateModel.email,
            this.stateModel.password,
            this.stateModel.mnemonic
        );
        
        if(areKeysImported) {
            await this.handleFirstLaunch();
            this.props.loginSuccess();
            this.props.redirectToMainScreen();
        } else {
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
        console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`);
        this._stopScan();
        try {
            const result = JSON.parse(e.nativeEvent.data.code);
            this.setState({ layout: 'success' });
            console.log(result);
            if(result.email && result.password && result.mnemonic) {
                this.stateModel.email = result.email;
                this.stateModel.password = result.password;
                this.stateModel.mnemonic = result.mnemonic;
                console.log(this.state);
                this.tryLogin();
            } 
            else { 
                console.log('not valid JSON');
                this.setState({ layout: 'error' });
                this._startScan();
            }
        }
        catch(error) {
            console.log(error);
            this.setState({ layout: 'error' });
        }
        this._startScan();
    }
 
    /**
     * Functions that starting and stopping scanning action in QRScannerComponent
     */
    _startScan = (e) => {
        this.setState({ layout: 'scanning' });
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
                layout = { this.state.layout }
                ref = { component => this._barComponent = component }
                viewAppear = { this.state.viewAppear }
                navigateBack = { this.navigateBack }
                onBarCodeRead = { this._onBarCodeRead }
            />
        )
    }  
}

/**
 * connecting reducer to component props 
 */
function mapStateToProps(state) { return { user: state.authReducer.user }; };
function mapDispatchToProps(dispatch) { return bindActionCreators(qrScannerActionCreators, dispatch); };

/**
 * Creating QRCodeScannerScreen container
 */
export default connect(mapStateToProps, mapDispatchToProps)(QRScannerContainer);
