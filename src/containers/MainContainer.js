import { Keyboard, DeviceEventEmitter, BackHandler, Platform } from 'react-native';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { mainContainerActions, favouritesActions } from '../reducers/mainContainer/mainReducerActions';
import fileActions, { mainContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { redirectToMainScreen } from '../reducers/navigation/navigationActions';
import FileModel from '../models/FileModel';
import BucketModel from '../models/BucketModel';
import ListItemModel from '../models/ListItemModel';
import StorjLib from '../utils/StorjModule';
import FilePicker from '../utils/filePicker';
import TabBarActionModelFactory from '../models/TabBarActionModel';
import MainComponent from '../components/MainComponent';
import filePicker from '../utils/filePicker';

import ServiceModule from '../utils/ServiceModule';
import SyncModule from '../utils/SyncModule';
import { uploadFileStart, uploadFileSuccess } from '../reducers/asyncActions/fileActionsAsync';

class MainContainer extends Component {
    constructor(props) {
        super(props);

        //this.state = {
        this.tapBarActions = [
            //actions for bucket screen
            TabBarActionModelFactory.createNewAction(() => { this.props.showCreateBucketInput(); }, 'Action 1', require('../images/ActionBar/NewBucketIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 2', require('../images/ActionBar/UploadFileIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 3', require('../images/ActionBar/UploadPhotoIcon.png'))
        ];

        this.selectionModeActions = [
            //actions for bucket screen
            TabBarActionModelFactory.createNewAction(
                () => { this.setFavourite(); }, 
                'Action 4',    
                require('../images/ActionBar/FavoritesIcon.png')
            ),
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 5', require('../images/ActionBar/DownloadIFileIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 6', require('../images/ActionBar/CopyBucketIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { this.deleteBuckets(); }, 'Action 7', require('../images/ActionBar/TrashBucketIcon.png'))
        ];
        
        this.openedBucketActions = [
            TabBarActionModelFactory.createNewAction(() => { this.uploadFile(); }, 'Action 8', require('../images/ActionBar/UploadFileIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { this.downloadSelectedFiles(); }, '2', require('../images/ActionBar/DownloadIFileIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { this.deleteSelectedFiles(); }, 'Action 9', require('../images/ActionBar/TrashBucketIcon.png'))
        ];

        this.downloadListener = (fileParams) => {
            let res = observablePropFactory.getObservable(fileParams.fileId);
            res.Property = fileParams;
        }

        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
    }

    async bindServicesAndEvents() {
        await ServiceModule.bindService();
        let uploadServiceBindResult = await ServiceModule.bindUploadService();
        //console.log("uploadServiceBindResult", uploadServiceBindResult);

        let result2 = await SyncModule.listBuckets();

        //console.log(result2);

        buckets = JSON.parse(result2.result).map((bucket) => {
            return new BucketModel(bucket);
        });

        console.log(buckets);

        this.props.getBuckets(buckets.map(bucket => new ListItemModel(bucket)));

        let uploadingFiles = [];

        buckets.forEach(async bucket => {
            result = await SyncModule.listUploadingFiles(bucket.Id);
            console.log(result);
            if(result.isSuccess) {
                uploadingFiles = uploadingFiles.concat(JSON.parse(result.result));
            }
        });

        console.log("uploadingFiles", uploadingFiles);

        DeviceEventEmitter.addListener("EVENT_BUCKETS_UPDATED", async (result) => {   
            console.log("FromEvent", result);      
            let result2 = await SyncModule.listBuckets();

            //console.log(result2);

            buckets = JSON.parse(result2.result).map((bucket) => {
                return new BucketModel(bucket);
            });

            console.log(buckets);

            this.props.getBuckets(buckets.map(bucket => new ListItemModel(bucket)));
        });

        DeviceEventEmitter.addListener("EVENT_FILES_UPDATED", async (result) => {
            console.log("FromEvent", result);
            let result2 = await SyncModule.listFiles("ea2c97f6d85f0b14c6f58de4");

            console.log(result2);
            console.log(JSON.parse(result2.result));
        });

        DeviceEventEmitter.addListener("EVENT_FILE_UPLOAD_START", async (response) => {
            console.log("EVENT_FILE_UPLOAD_START", response);

            this.props.getUploadingFile(response.fileHandle);
        });

        DeviceEventEmitter.addListener("EVENT_FILE_UPLOADED_PROGRESS", async (result) => {
            console.log("EVENT_FILE_UPLOADED_PROGRESS", result);
            //bucketId, filePath, progress, fileRef
            this.props.updateFileUploadProgress(result.fileHandle, result.progress, result.uploaded);
            //let uploadingfile = JSON.parse(result.result);
            //console.log(uploadingfile);
        });
        DeviceEventEmitter.addListener("EVENT_FILE_UPLOADED_SUCCESSFULLY", async (result) => {
            console.log("EVENT_FILE_UPLOADED_SUCCESSFULLY", result);

            console.log(result);
            this.props.uploadSuccess(result.fileHandle, result.fileId);
            //let response = JSON.parse(result);
            //console.log(response);
        });
        DeviceEventEmitter.addListener("EVENT_FILE_UPLOAD_ERROR", async (result) => {
            console.log("EVENT_FILE_UPLOAD_ERROR", result);

            this.props.uploadFileError(result.fileHandle);
            //let response = JSON.parse(result);
            //console.log(response);
        });
    }

    async componentWillMount () {
        this.bindServicesAndEvents();

        if(Platform.OS === "android") {
            BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress);
        }

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { this.props.disableSelectionMode(); });
    }

    async componentDidMount() {
        ServiceModule.getBuckets();
    }
    
    componentWillUnmount () {
        if(Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress");
        }

        observablePropFactory.clean();

        this.keyboardDidShowListener.remove();
    }

    onHardwareBackPress() {
        if(this.props.isLoading)
            return;

        const index = this.props.mainNavReducer.index;
        const routes = this.props.mainNavReducer.routes;   

        if(this.props.isSelectionMode 
        || this.props.isSingleItemSelected 
        || this.props.isActionBarShown) {

            this.props.disableSelectionMode();
        }

        if(routes[index].routeName === "ImageViewerScreen") {
            this.props.redirectToMainScreen();
            return;
        }
    }

    onCreateBucketPress() {
        this.props.showCreateBucketInput();
    }

    onActionBarPress() {
        this.props.isActionBarShown ? 
            this.props.hideActionBar() : this.props.showActionBar();
    }

    async uploadFile() {
        let filePickerResponse = await filePicker.show();
        this.props.hideActionBar();

        if(filePickerResponse.path) {
            const path = filePickerResponse.path;

            ServiceModule.uploadFile(this.props.openedBucketId, path);
        }
    }

    async downloadFile(file, localPath) {        
        const fileId = file.getId();
        const observer = observablePropFactory.getObservable(fileId);
        

        observer.addListener({ id: fileId, callback: (param) => { 
            if(this.props.openedBucketId === param.bucketId)
                this.props.updateFileDownloadProgress(param.bucketId, fileId, param.progress, param.filePointer);
        }});

        let response = await StorjLib.downloadFile(this.props.openedBucketId, fileId, localPath);

        if(response.isSuccess) {
            this.props.downloadFileSuccess(this.props.openedBucketId, fileId, localPath);
        } else {
            this.props.downloadFileError(this.props.openedBucketId, fileId);
        }
    }

    async downloadSelectedFiles() {
        this.props.fileListModels.forEach(fileEntry => {
            fileEntry.files.forEach(fileItem => {
                if(fileItem.isSelected) {
                    this.downloadFile(fileItem, '/storage/emulated/0/Download/' + fileItem.getName()); 
                }
            });
        });
    }

    async deleteFile(bucketId, fileId) {
        ServiceModule.deleteFile(bucketId, fileId);
    }

    deleteSelectedFiles() {
        this.props.fileListModels.forEach(fileEntry => {
            fileEntry.files.forEach(fileItem => {
                if(fileItem.isSelected)
                    this.deleteFile(fileEntry.bucketId, fileItem.getId());
            });
        });
    }

    async createBucket(name) {   
        ServiceModule.createBucket(name);        
    }

    async deleteBucket(bucket) {
        ServiceModule.deleteBucket(bucket.getId());
    }

    getSelectedBuckets() {
        let selectedBuckets = [];

        this.props.buckets.map(item => {
            if(item.isSelected) {
                selectedBuckets.push(item);
            }
        });

        return selectedBuckets;
    }

    async setFavourite() {
        let selectedBuckets = this.getSelectedBuckets();
        let length = selectedBuckets.length;
        let itemsToStarred = [];
        let itemsToUnstarred = [];

        for(var i = 0; i < length; i++) {
            var item = selectedBuckets[i];
            let updateStarredResponse = await ServiceModule.updateBucketStarred(item.getId(), !item.getStarred());

            if(updateStarredResponse.isSuccess) {
                item.getStarred() 
                    ? itemsToUnstarred.push(item) 
                    : itemsToStarred.push(item);
            }    
        }

        this.props.updateFavourite(selectedBuckets);        
    }

    deleteBuckets() {
        this.getSelectedBuckets().forEach(item => {
            this.deleteBucket(item);
        });

        if(this.props.isSingleItemSelected)
            this.props.disableSelectionMode();
    }

    static navigationOptions = {
        header: null
    };

    render() {
        const index = this.props.bucketsScreenNavReducer.index;
        const routes = this.props.bucketsScreenNavReducer.routes;
        let tapBarActions = this.tapBarActions;
        
        if(this.props.openedBucketId)
            tapBarActions = this.openedBucketActions;
        else if(this.props.isSelectionMode || this.props.isSingleItemSelected)
            tapBarActions = this.selectionModeActions;
        
        return(
            <MainComponent
                isGridViewShown = { this.props.isGridViewShown }
                setGridView = { this.props.setGridView }
                setListView = { this.props.setListView }
                bucketScreenRouteName = { routes[index].routeName }
                createBucket = { this.createBucket.bind(this) }
                hideCreateBucketInput = { this.props.hideCreateBucketInput }
                tapBarActions = { tapBarActions } 
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                onActionBarPress = { () => { this.onActionBarPress(); } }
                isActionBarShown = { this.props.isActionBarShown } 
                isCreateBucketInputShown = { this.props.isCreateBucketInputShown }
                isLoading = { this.props.isLoading } />
        );
    }
}

function mapStateToProps(state) { 
    return {
        bucketsScreenNavReducer: state.bucketsScreenNavReducer,
        mainNavReducer: state.navReducer,
        fileListModels: state.filesReducer.fileListModels,
        openedBucketId: state.mainReducer.openedBucketId,
        isSelectionMode: state.mainReducer.isSelectionMode, 
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        isActionBarShown: state.mainReducer.isActionBarShown,
        buckets: state.mainReducer.buckets,
        isCreateBucketInputShown: state.mainReducer.isCreateBucketInputShown,
        isFirstSignIn: state.mainReducer.isFirstSignIn,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown
    };
}
function mapDispatchToProps(dispatch) { 
    return {
        ...bindActionCreators({ ...fileActions, redirectToMainScreen, ...mainContainerActions, ...mainContainerFileActions, ...favouritesActions }, dispatch),
        getUploadingFile: (fileHandle) => dispatch(uploadFileStart(fileHandle)),
        uploadSuccess: (fileHandle, fileId) => dispatch(uploadFileSuccess(fileHandle, fileId)) 
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);