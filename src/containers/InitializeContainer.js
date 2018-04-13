<<<<<<< HEAD
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Keyboard
} from 'react-native';
=======
>>>>>>> [REWORKED] Initialize screen
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../reducers/navigation/navigationActions';
import { getDebits, getCredits, getWallets }  from '../reducers/billing/billingActions';
import StorjLib from '../utils/StorjModule';
import { authConstants } from '../utils/constants/storageConstants';
import { getMnemonicNotSaved, getFirstAction } from '../utils/AsyncStorageModule';
import ListItemModel from '../models/ListItemModel';
import FileModel from '../models/FileModel';
import BucketModel from '../models/BucketModel';
import { initializeContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { initializeContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { initializeActionCreators } from '../reducers/authentification/authActions';
import allFileActions from '../reducers/mainContainer/Files/filesReducerActions';
import ServiceModule from '../utils/ServiceModule';
import SyncModule from '../utils/SyncModule';
import PropTypes from 'prop-types';
import InitializeComponent from '../components/InitializeComponent';

class InitializeContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filledPins: "",
            enterPassCode: false,
            isPasscodeWrong: false,
            infoText: 'Enter PIN',
            isError: false,
            isLoading: false,
            isFinished: false
        };

        this.REGULAR_MESSAGE = "Enter PIN";
        this.ERROR_MESSAGE = 'Wrong PIN, try again';
        this.pincode = '';
    };

    async componentWillMount() {
        this.keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
            this.setState({ isKeyboardShown: false });
        });
        this.keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
            this.setState({ isKeyboardShown: true });
        });
        
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

        this.setState({ isError: false, infoText: this.REGULAR_MESSAGE });
    }

    componentWillUnmount() {
        this.keyboardHideListener.remove();
        this.keyboardShowListener.remove();
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

        this.props.setEmail(getKeysResult.email);
        this.props.getDebits();
        this.props.getCredits();
        this.props.getWallets(); 

        this.props.redirectToMainScreen();    
    }

    async getAllBuckets() {
        let bucketsResponse = await SyncModule.listBuckets();

        if(bucketsResponse.isSuccess) {
            let buckets = JSON.parse(bucketsResponse.result).map((file) => {
                return new ListItemModel(new BucketModel(file));
            });                    

            this.props.getBuckets(buckets);
        }
    }

    async getAllFiles() {
        let filesResponse = await SyncModule.listAllFiles();		

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
                ref = { component => this._initializeComponent = component }
                enterPassCode = { this.state.enterPassCode }
                isError = { this.state.isError }
                filledPins = { this.state.filledPins }
                onChangePasscode = { this.onChangePasscode.bind(this) }
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
function mapStateToProps(state) { return { navigation: state.navReducer }; };
function mapDispatchToProps(dispatch) { return bindActionCreators({
        ...Actions,
        ...initializeContainerActions,
        ...initializeActionCreators, 
        ...initializeContainerBucketActions,
        ...allFileActions, getDebits, getCredits, getWallets }, dispatch); };

/**
 * Creating LoginScreen container
 */
export default connect(mapStateToProps, mapDispatchToProps)(InitializeContainer);

InitializeContainer.propTypes = {
    bucketNavigateBack: PropTypes.func,
    dashboardNavigateBack: PropTypes.func,
    deleteFile: PropTypes.func,
    deselectFile: PropTypes.func,
    downloadFileError: PropTypes.func,
    downloadFileSuccess: PropTypes.func,
    fileDownloadCanceled: PropTypes.func,
    fileUploadCanceled: PropTypes.func,
    getBuckets: PropTypes.func,
    getCredits: PropTypes.func,
    getDebits: PropTypes.func,
    getWallets: PropTypes.func,
    listFiles: PropTypes.func,
    listUploadingFiles: PropTypes.func,
    navigateBack: PropTypes.func,
    navigateToDashboardFilesScreen: PropTypes.func,
    navigateToFilesScreen: PropTypes.func,
    navigation: PropTypes.object,
    openImageViewer: PropTypes.func,
    redirectToBalanceScreen: PropTypes.func,
    redirectToChangePasswordScreen: PropTypes.func,
    redirectToInitializationScreen: PropTypes.func,
    redirectToLoginScreen: PropTypes.func,
    redirectToMainScreen: PropTypes.func,
    redirectToMnemonicConfirmationScreen: PropTypes.func,
    redirectToMnemonicConfirmedScreen: PropTypes.func,
    redirectToMnemonicGenerationScreen: PropTypes.func,
    redirectToMnemonicInfoScreen: PropTypes.func,
    redirectToMnemonicNotConfirmedScreen: PropTypes.func,
    redirectToMyAccountScreen: PropTypes.func,
    redirectToOnBoardingScreen: PropTypes.func,
    redirectToPinCodeGenerationScreen: PropTypes.func,
    redirectToRegisterScreen: PropTypes.func,
    redirectToRegisterSuccessScreen: PropTypes.func,
    redirectToSettingsScreen: PropTypes.func,
    redirectToStorageScreen: PropTypes.func,
    screenProps: PropTypes.object,
    selectFile: PropTypes.func,
    setEmail: PropTypes.func,
    setFirstSignIn: PropTypes.func,
    updateFileDownloadProgress: PropTypes.func,
    updateFileUploadProgress: PropTypes.func,
    uploadFileError: PropTypes.func,
    uploadFileStart: PropTypes.func,
    uploadFileSuccess: PropTypes.func
};