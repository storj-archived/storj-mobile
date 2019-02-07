import React, { Component } from 'react';
import {
	BackHandler,
	Platform,
	View,
	DeviceEventEmitter,
	NativeEventEmitter,
	StyleSheet,
	NetInfo
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addNavigationHelpers } from 'react-navigation';
import StackNavigator from '../navigators/StackNavigator';
import eventNames from '../utils/constants/eventNames';
import {
	setLoading,
	unsetLoading,
	popLoading,
	setIsConnected
} from '../reducers/mainContainer/mainReducerActions';
import { saveMnemonic } from '../reducers/authentification/authActions';
import {
	setNameAlreadyExistException,
	unsetNameAlreadyExistException,
	createBucket,
	getBuckets,
    deleteBucket
} from '../reducers/mainContainer/Buckets/bucketReducerActions';
import {
    uploadFileError,
    updateFileUploadProgress,
    downloadFileSuccess,
    downloadFileError,
    updateFileDownloadProgress,
	deleteFile,
	listFiles
} from '../reducers/mainContainer/Files/filesReducerActions'
import {
	redirectToLoginScreen,
    redirectToMainScreen,
    redirectToMnemonicConfirmationScreen,
    redirectToMnemonicConfirmedScreen,
    redirectToMnemonicGenerationScreen,
    redirectToMnemonicInfoScreen,
    redirectToMnemonicNotConfirmedScreen,
    redirectToRegisterScreen,
	redirectToRegisterSuccessScreen,
	redirectToMnemonicHelpScreen,
	navigateBack
} from '../reducers/navigation/navigationActions';
import ListItemModel from '../models/ListItemModel';
import BucketModel from '../models/BucketModel';
import FileModel from '../models/FileModel';
import WarningComponent from '../components/Common/WarningComponent';
import { uploadFileStart, uploadFileSuccess } from '../reducers/asyncActions/fileActionsAsync';
import { listSyncQueueEntriesAsync, getSyncQueueEntryAsync } from "../reducers/mainContainer/SyncQueue/syncQueueReducerAsyncActions";
import { listSettingsAsync } from "../reducers/mainContainer/MyAccount/Settings/SettingsActionsAsync";

import SyncModule from '../utils/syncModule';
import ServiceModule from '../utils/serviceModule';

import { statusBarHeightIos } from "../utils/adaptive";

/**
 * Component that contains main navigator
 */

class Apps extends Component {

	constructor(props) {
        super(props);

		this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
		this.getbucketsListener = null;
		this.bucketCreatedListener = null;
		this.bucketDeletedListener = null;
		this.fileDeletedListener = null;
		this.getFilesListener = null;
		this.downloadFileStartListener = null;
		this.downloadFileProgressListener = null;
		this.downloadFileSuccessListener = null;
		this.downloadFileErrorListener = null;
		this.syncQueueEntryUpdateListener = null;
		this.syncStartedListener = null;

		this.isAndroid = Platform.OS === "android";
		this.timer = null;
    }

	async componentWillMount() {
		let eventEmitter = this.isAndroid ? DeviceEventEmitter : new NativeEventEmitter(ServiceModule.getServiceNativeModule());
        
		this.getbucketsListener = eventEmitter.addListener(eventNames.EVENT_BUCKETS_UPDATED, this.onBucketsReceived.bind(this));
		this.bucketCreatedListener = eventEmitter.addListener(eventNames.EVENT_BUCKET_CREATED, this.onBucketCreated.bind(this));
		this.bucketDeletedListener = eventEmitter.addListener(eventNames.EVENT_BUCKET_DELETED, this.onBucketDeleted.bind(this));
		
		this.fileDeletedListener = eventEmitter.addListener(eventNames.EVENT_FILE_DELETED, this.onFileDeleted.bind(this));
		this.getFilesListener = eventEmitter.addListener(eventNames.EVENT_FILES_UPDATED, this.onFilesReceived.bind(this));
		
		this.fileUploadStartedListener = eventEmitter.addListener(eventNames.EVENT_FILE_UPLOAD_START, this.onFileUploadStart.bind(this));
		this.fileUploadProgressListener = eventEmitter.addListener(eventNames.EVENT_FILE_UPLOADED_PROGRESS, this.fileUploadProgress.bind(this));
		this.fileUploadSuccessListener = eventEmitter.addListener(eventNames.EVENT_FILE_UPLOADED_SUCCESSFULLY, this.fileUploadSuccess.bind(this));
		this.fileUploadErrorListener = eventEmitter.addListener(eventNames.EVENT_FILE_UPLOAD_ERROR, this.fileUploadError.bind(this));

		this.downloadFileStartListener = eventEmitter.addListener(eventNames.EVENT_FILE_DOWNLOAD_START, this.onFileDownloadStart.bind(this));
		this.downloadFileProgressListener = eventEmitter.addListener(eventNames.EVENT_FILE_DOWNLOAD_PROGRESS, this.onFileDownloadProgress.bind(this));
		this.downloadFileSuccessListener = eventEmitter.addListener(eventNames.EVENT_FILE_DOWNLOAD_SUCCESS, this.onFileDownloadSuccess.bind(this));
		this.downloadFileErrorListener = eventEmitter.addListener(eventNames.EVENT_FILE_DOWNLOAD_ERROR, this.onFileDownloadError.bind(this));

		this.syncQueueEntryUpdateListener = eventEmitter.addListener(eventNames.EVENT_SYNC_ENTRY_UPDATED, this.onSyncQueueEntryUpdated.bind(this));
		this.syncStartedListener = eventEmitter.addListener(eventNames.EVENT_SYNC_STARTED, this.onSyncStarted.bind(this));

		NetInfo.isConnected.fetch().then(isConnected => {
			this.props.setIsConnected(isConnected);
		});

		NetInfo.isConnected.addEventListener('connectionChange', this.onConnectionChange.bind(this));

		if(this.isAndroid) {
			await ServiceModule.bindGetBucketsService();
			await ServiceModule.bindDownloadService();
		}

		//ServiceModule.startSync();
	}
	
	onConnectionChange(isConnected) {
		this.props.setIsConnected(isConnected);

		if(!isConnected) {

		}
	}

	async fileUploadError(result) {
		this.props.uploadFileError(result.fileHandle);
	}

	async fileUploadSuccess(result) {
		this.props.uploadSuccess(result.fileHandle, result.fileId);
	}

	async fileUploadProgress(result) {
		this.props.updateFileUploadProgress(result.fileHandle, result.progress, result.uploaded);
	}

	async onFileUploadStart(result) {
		this.props.getUploadingFile(result.fileHandle);
	}

	componentDidMount() {
		if(Platform.OS === 'android') {
			BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
	}

	onFileDownloadStart(params) {
		this.props.updateFileDownloadProgress(null, params.fileId, params.progress, params.fileHandle);
	}

	onFileDownloadProgress(params) {
		this.props.updateFileDownloadProgress(null, params.fileId, params.progress, params.fileHandle);
	}

	onFileDownloadSuccess(params) {		
		this.props.downloadFileSuccess(null, params.fileId, params.localPath, params.thumbnail);
	}

	onFileDownloadError(params) {
		this.props.downloadFileError(null, params.fileId);
	}

	onSyncStarted() {
		this.props.listSettings(this.props.email);
		this.props.listSyncQueueEntriesAsync();
	}

	onSyncQueueEntryUpdated(params) { //TODO: name error
		this.props.getSyncQueueEntryAsync(params.syncEntryId);
	}

	componentWillUnmount() {
		if(Platform.OS === 'android') {
			BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
		
		this.getbucketsListener.remove();
		this.bucketCreatedListener.remove();
		this.bucketDeletedListener.remove();
		this.fileDeletedListener.remove();
		this.getFilesListener.remove();
		this.downloadFileStartListener.remove();
		this.downloadFileProgressListener.remove();
		this.downloadFileSuccessListener.remove();
		this.downloadFileErrorListener.remove();
		this.syncQueueEntryUpdateListener.remove();
		this.syncStartedListener.remove();
	}

	onHardwareBackPress() {
		if (this.props.nav.index === 0) {
			return true;
		}

		//this.props.dispatch(NavigationActions.back());
		return true;
	}

	async onFilesReceived(response) {
		if(response.isSuccess) {
			let filesResponse = await SyncModule.listFiles(response.result, this.props.sortingMode);		

			if(filesResponse.isSuccess) {
				let files = JSON.parse(filesResponse.result).map((file) => {
					return new ListItemModel(new FileModel(file));
				});                    
				this.props.listFiles(response.result, files);
			}
		}
        
		this.props.popLoading(response.result);
	}
	
	unsetNameAlreadyExistException() {
		this.props.unsetNameAlreadyExistException();
		clearTimeout(this.timer);
	}

	unsetInternetConnectionException() {
		this.props.unsetNameAlreadyExistException();
		clearTimeout(this.timer);
	}

	onBucketCreated(response) {
		if(response.isSuccess) {
			this.props.createBucket(new ListItemModel(new BucketModel(JSON.parse(response.result))));	
		} else {
			switch(response.error.errorCode) {				
				case 409:
					this.props.setNameAlreadyExistException();
					this.timer = setTimeout(this.unsetNameAlreadyExistException.bind(this), 3000);
					break;
				case 10006:
					this.props.setNameAlreadyExistException(); //TODO: add internet exc
					this.timer = setTimeout(this.unsetNameAlreadyExistException.bind(this), 3000);
					break;
				default:
					this.props.setNameAlreadyExistException(); //TODO: add default exc
					this.timer = setTimeout(this.unsetNameAlreadyExistException.bind(this), 3000);
					break;
			}
		}
	}

	async onBucketsReceived() {
        this.props.setLoading();
		let bucketsResponse = await SyncModule.listBuckets(this.props.sortingMode);

        if(bucketsResponse.isSuccess) {
            let buckets = JSON.parse(bucketsResponse.result).map((file) => {
                return new ListItemModel(new BucketModel(file));
            });                    

			ServiceModule.createBaseBuckets(buckets);

            this.props.getBuckets(buckets);
        }
		
        this.props.unsetLoading();
	}

	onBucketDeleted(response) {	
		if(response.isSuccess) {
			this.props.deleteBucket(response.result);
		}
	}
	
	onFileDeleted(response) {		
		if(response.isSuccess) {
			let result = JSON.parse(response.result);
			this.props.deleteFile(result.bucketId, result.fileId);
		}
	}

	chooseWarning() {
		let color = '#EB5757';
		let message;

		if(!this.props.isEmailConfirmed) {			
			message = 'Please confirm your email';
		} else if(!this.props.isAccountExist) {			
			message = 'This account doesn`t exist';
		} else if(this.props.isNameExistException) {			
			message = 'Name already used by another bucket';
		} if(!this.props.isConnected) {			
			message = 'No internet connection';
		} else {
			color = null;
			message = null;
		}	

		return <WarningComponent
						message = { message }
						statusBarColor = { color } />;
	}

	render() {
		return (
			<View style = { styles.mainContainer }>
				<StackNavigator 
					screenProps = {{
						saveMnemonic: this.props.saveMnemonic,
						redirectToLoginScreen: this.props.redirectToLoginScreen,
						redirectToMainScreen: this.props.redirectToMainScreen,
						redirectToMnemonicConfirmationScreen: this.props.redirectToMnemonicConfirmationScreen,
						redirectToMnemonicConfirmedScreen: this.props.redirectToMnemonicConfirmedScreen,
						redirectToMnemonicGenerationScreen: this.props.redirectToMnemonicGenerationScreen,
						redirectToMnemonicInfoScreen: this.props.redirectToMnemonicInfoScreen,
						redirectToMnemonicNotConfirmedScreen: this.props.redirectToMnemonicNotConfirmedScreen,
						redirectToRegisterSuccessScreen: this.props.redirectToRegisterSuccessScreen,
						redirectToRegisterScreen: this.props.redirectToRegisterScreen,
						redirectToMnemonicHelpScreen: this.props.redirectToMnemonicHelpScreen,
						navigateBack : this.props.navigateBack
					}}
					navigation = { addNavigationHelpers({
						dispatch: this.props.dispatch,
						state: this.props.nav					
					})}
				/>
				{
					this.chooseWarning()
				}	
			</View>
		);
	};
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: Platform.select({
			ios: statusBarHeightIos,
			android: 0
		})
	}
});

/**
 * connecting navigation reducer to component props
 */
function mapStateToProps(state) {
    return {
		nav: state.navReducer,
		isEmailConfirmed: state.authReducer.user.isEmailConfirmed,
		isAccountExist: state.authReducer.user.isAccountExist,
		isNameExistException: state.bucketReducer.isNameExistException,
		sortingMode: state.mainReducer.sortingMode,
		isConnected: state.mainReducer.isConnected,
		email: state.authReducer.user.email
    };
}

function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators( {
		saveMnemonic,
		setLoading,
		unsetLoading, 
		setNameAlreadyExistException,
		unsetNameAlreadyExistException,
		createBucket,
		getBuckets,
		popLoading,
		deleteBucket,
		uploadFileError,
		updateFileUploadProgress,
		downloadFileSuccess,
		downloadFileError,
		updateFileDownloadProgress,
		deleteFile,
		listFiles,
		setIsConnected,
		redirectToLoginScreen,
		redirectToMainScreen,
		redirectToMnemonicConfirmationScreen,
		redirectToMnemonicConfirmedScreen,
		redirectToMnemonicGenerationScreen,
		redirectToMnemonicInfoScreen,
		redirectToMnemonicHelpScreen,
		redirectToMnemonicNotConfirmedScreen,
		redirectToRegisterScreen,
		redirectToRegisterSuccessScreen,
		navigateBack,
		listSyncQueueEntriesAsync,
		getSyncQueueEntryAsync  }, dispatch),
		listSettings: (settingsId) => dispatch(listSettingsAsync(settingsId)),
		uploadSuccess: (fileHandle, fileId) => dispatch(uploadFileSuccess(fileHandle, fileId)),		
		getUploadingFile: (fileHandle) => dispatch(uploadFileStart(fileHandle))};
}

/**
 * Creating navigator container
 */
export const AppWithNavigationState = connect(mapStateToProps, mapDispatchToProps)(Apps);
 