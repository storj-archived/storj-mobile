import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import InputComponent from '../components/InputComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../reducers/navigation/navigationActions';
import { getDebits, getCredits, getWallets }  from '../reducers/billing/billingActions';
import StorjLib from '../utils/StorjModule';
import { getWidth, getHeight } from '../utils/adaptive';
import { authConstants } from '../utils/constants/storageConstants';
import { getMnemonicNotSaved, getFirstAction } from '../utils/AsyncStorageModule';
import ListItemModel from '../models/ListItemModel';
import FileModel from '../models/FileModel';
import BucketModel from '../models/BucketModel';
import { initializeContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { initializeContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import allFileActions from '../reducers/mainContainer/Files/filesReducerActions';
import ServiceModule from '../utils/ServiceModule';
import SyncModule from '../utils/SyncModule';
import PropTypes from 'prop-types';

class InitializeContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passcode: "",
            enterPassCode: false,
            isPasscodeWrong: false
        };
    };

    async componentWillMount() {        
        try {
            if(!await getFirstAction()) {
                this.props.redirectToOnBoardingScreen();
                return;
            }

            if(await getMnemonicNotSaved() === 'false') {
                this.props.redirectToMnemonicGenerationScreen();
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

    onChangePassode(value) {
        this.setState({ passcode: value });
    }

    async getKeys() {        
        let getKeyResponse = await StorjLib.getKeys(this.state.passcode);
        
        if(!getKeyResponse.isSuccess) { 
            this.setState({ enterPassCode: true });   
            return;
        }

        let getKeysResult = JSON.parse(getKeyResponse.result);

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

			ServiceModule.createBaseBuckets(buckets);

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
        this.getKeys();
    }

    render() {
        return(
                <View style = { styles.mainContainer }>
                    <View style = { styles.backgroundWrapper }>
                        <Image 
                            style = { styles.logo } 
                            source = { require('../images/Icons/LogoBlue.png') } 
                            resizeMode = 'contain' />
                    </View>
                        {
                            (()=>{
                                if(this.state.enterPassCode){
                                    return(
                                        <View style = { styles.contentWrapper }>
                                        <InputComponent 
                                                onChangeText = { this.onChangePassode.bind(this) }
                                                isPassword = { true } 
                                                placeholder = {'Passcode'} 
                                                value = { this.state.passcode }
                                                isError = { this.state.isPasscodeWrong }
                                                errorMessage = {'Invalid passcode'} />
                                        <TouchableOpacity 
                                            style = { styles.createAccountButton } 
                                            onPressOut = { this.onSubmit.bind(this) }>
                                                <Text style = { styles.createAccountText }>SIGN IN</Text>
                                        </TouchableOpacity>
                                    </View>);
                                }
                            })()
                        }                 
                    </View> 
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    backgroundWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        height: getHeight(100),
        marginBottom: getHeight(160)
    },
    splash: {
        height: getHeight(667),
        width: getWidth(375)
    },
    splashLogo: {
        marginTop: getHeight(268),
        marginBottom: getHeight(321),
        marginLeft: getWidth(114),
        marginRight: getWidth(87),
        height: getHeight(78),
        width: getWidth(174)
    },
    contentWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: getHeight(100)
    },
    createAccountButton: {
        width: getWidth(343),
        height: getHeight(55),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2782ff',
        borderRadius: getWidth(8)
     },
     createAccountText: {
         fontFamily: 'Montserrat-Bold',
         fontSize: getHeight(14),
         color: 'white'
     }
});

/**
 * connecting reducer to component props 
 */
function mapStateToProps(state) { return { navigation: state.navReducer }; };
function mapDispatchToProps(dispatch) { return bindActionCreators({
        ...Actions,
        ...initializeContainerActions, 
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