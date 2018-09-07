import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    redirectToMainScreen,
    redirectToRegisterScreen,
    redirectToOnBoardingScreen
} from '../reducers/navigation/navigationActions';
import { getDebits, getCredits, getWallets }  from '../reducers/billing/billingActions';
import { listSettingsAsync } from "../reducers/mainContainer/MyAccount/Settings/SettingsActionsAsync";
import StorjLib from '../utils/StorjModule';
import { getFirstAction } from '../utils/AsyncStorageModule';
import ListItemModel from '../models/ListItemModel';
import FileModel from '../models/FileModel';
import BucketModel from '../models/BucketModel';
import { 
    setFirstSignIn,
    setEmail 
} from '../reducers/mainContainer/mainReducerActions';
import { getBuckets } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { 
    login,
    redirectToQRScannerScreen,
    redirectToLoginScreen,
    navigateToRegisterScreen 
} from '../reducers/authentification/authActions';
import {
    listFiles
} from '../reducers/mainContainer/Files/filesReducerActions';
import ServiceModule from '../utils/ServiceModule';
import SyncModule from '../utils/SyncModule';
import PropTypes from 'prop-types';
import InitializeComponent from '../components/InitializeComponent';

class InitializeContainer extends Component {
    constructor(props) {
        super(props);

        this.REGULAR_MESSAGE = "Enter PIN";
        this.ERROR_MESSAGE = 'Wrong PIN, try again';
        this.pincode = '';

        this.state = {
            filledPins: "",
            enterPassCode: false,
            isPasscodeWrong: false,
            infoText: this.REGULAR_MESSAGE,
            isError: false,
            isLoading: false,
            isFinished: false,
            isFirstLaunch: true
        };

        this.onChangePasscode = this.onChangePasscode.bind(this);
        this._onRef = this._onRef.bind(this);
    };

    async componentWillMount() {
        try {
            if(!await getFirstAction()) {
                this.props.redirectToOnBoardingScreen();
                return;
            }
            
            if(!await StorjLib.keysExists()) {
                this.props.redirectToLoginScreen();
                return;
            }

            await this.getKeys();
        } catch(e) {            
            this.props.redirectToOnBoardingScreen();
        }
    }

    _onRef(ref) {
        this._initializeComponent = ref;
    }

    onChangePasscode(value) {
        if(this.state.isFinished) return;
        if(this.state.isError) this.setState({ isError: false, infoText: this.REGULAR_MESSAGE })
        this.setState({ filledPins: value });
        this.pincode = value;

        if(this.pincode.length === 4) {
            this.onSubmit();
        }
    }

    async getKeys() {        
        let getKeyResponse = await StorjLib.getKeys(this.pincode);
        this.pincode = '';
        
        if(!getKeyResponse.isSuccess) {
            this.setState({ isFinished: false });

            if(this.state.isFirstLaunch) { 
                this.setState({ enterPassCode: true, isFirstLaunch: false });  

                return; 
            }

            this.setState({ enterPassCode: true, isLoading: false, infoText: this.ERROR_MESSAGE, isError: true });   
            return;
        }

        let getKeysResult = JSON.parse(getKeyResponse.result);
        this.props.login(getKeysResult.email, getKeysResult.password, getKeysResult.mnemonic);

        let getSettingsResponse = await SyncModule.listSettings(getKeysResult.email);

        if(getSettingsResponse.isSuccess) {
            let settingsModel = JSON.parse(getSettingsResponse.result);
            if(settingsModel.isFirstSignIn) 
                this.props.setFirstSignIn();
        }

        this.getAllBuckets();
        ServiceModule.getBuckets();                
        this.getAllFiles();
        this.props.listSettings(getKeysResult.email);
        this.props.setEmail(getKeysResult.email);
        this.props.getDebits();
        this.props.getCredits();
        this.props.getWallets(); 

        this.props.redirectToMainScreen();    
    }

    async getAllBuckets() {
        let bucketsResponse = await SyncModule.listBuckets(this.props.sortingMode);

        if(bucketsResponse.isSuccess) {
            let buckets = JSON.parse(bucketsResponse.result).map((file) => {
                return new ListItemModel(new BucketModel(file));
            });                    

            this.props.getBuckets(buckets);
        }
    }

    async getAllFiles() {
        let filesResponse = await SyncModule.listAllFiles(this.props.sortingMode);		

        if(filesResponse.isSuccess) {
            let files = JSON.parse(filesResponse.result).map((file) => {
                return new ListItemModel(new FileModel(file));
            });                    

            this.props.listFiles(this.props.openedBucketId, files);
        }
    }

    onSubmit() {
        this.setState({ isFinished: true });
        this.setState({isLoading: true, filledPins: ''});
        this._initializeComponent._inputComponent._textInput.clear();
        this.getKeys();
    }

    render() {
        return(
            <InitializeComponent
                ref = { this._onRef }
                enterPassCode = { this.state.enterPassCode }
                isError = { this.state.isError }
                filledPins = { this.state.filledPins }
                onChangePasscode = { this.onChangePasscode }
                isPasscodeWrong = { this.state.isPasscodeWrong }
                isLoading = { this.state.isLoading }
                infoText = { this.state.infoText }
                redirectToLoginScreen = { this.props.redirectToLoginScreen }
                redirectToQRScannerScreen = { this.props.redirectToQRScannerScreen }
                redirectToRegisterScreen = { this.props.navigateToRegisterScreen } />
        );
    }
}

/**
 * connecting reducer to component props 
 */
function mapStateToProps(state) { return { sortingMode: state.mainReducer.sortingMode, navigation: state.navReducer }; };
function mapDispatchToProps(dispatch) { 
    return {
        ...bindActionCreators({
            redirectToLoginScreen,
            redirectToMainScreen,
            redirectToRegisterScreen,
            setFirstSignIn,
            setEmail,
            login,
            redirectToQRScannerScreen,
            navigateToRegisterScreen, 
            redirectToOnBoardingScreen,
            getBuckets,
            listFiles, 
            getDebits, 
            getCredits, 
            getWallets }, dispatch),
            listSettings: (settingsId) => dispatch(listSettingsAsync(settingsId))
    };
};

/**
 * Creating LoginScreen container
 */
export default connect(mapStateToProps, mapDispatchToProps)(InitializeContainer);

InitializeContainer.propTypes = {
    bucketNavigateBack: PropTypes.func,
    dashboardNavigateBack: PropTypes.func,
    getBuckets: PropTypes.func,
    getCredits: PropTypes.func,
    getDebits: PropTypes.func,
    getWallets: PropTypes.func,
    listFiles: PropTypes.func,
    navigateToDashboardFilesScreen: PropTypes.func,
    navigateToFilesScreen: PropTypes.func,
    navigation: PropTypes.object,
    openImageViewer: PropTypes.func,
    redirectToInitializationScreen: PropTypes.func,
    redirectToLoginScreen: PropTypes.func,
    redirectToMainScreen: PropTypes.func,
    redirectToOnBoardingScreen: PropTypes.func,
    redirectToRegisterScreen: PropTypes.func,
    screenProps: PropTypes.object,
    setEmail: PropTypes.func,
    setFirstSignIn: PropTypes.func
};