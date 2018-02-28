import { Keyboard, DeviceEventEmitter } from 'react-native';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { mainContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { mainContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import FileModel from '../models/FileModel';
import ListItemModel from '../models/ListItemModel';
import StorjLib from '../utils/StorjModule';
import FilePicker from '../utils/filePicker';
import TabBarActionModelFactory from '../models/TabBarActionModel';
import MainComponent from '../components/MainComponent';
import filePicker from '../utils/filePicker';
import observablePropFactory from '../models/ObservableProperty';

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
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 1', require('../images/ActionBar/FavoritesIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 2', require('../images/ActionBar/DownloadIFileIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 3', require('../images/ActionBar/CopyBucketIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { this.deleteBuckets(); }, 'Action 3', require('../images/ActionBar/TrashBucketIcon.png'))
        ];
        
        this.openedBucketActions = [
            TabBarActionModelFactory.createNewAction(() => { this.uploadFile(); }, 'Action 1', require('../images/ActionBar/UploadFileIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { this.downloadSelectedFiles(); }, '2', require('../images/ActionBar/DownloadIFileIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { this.deleteSelectedFiles(); }, 'Action 3', require('../images/ActionBar/TrashBucketIcon.png'))
        ];


        this.uploadListener = (fileParams) => {
            let res = observablePropFactory.getObservable(fileParams.filePath);
            res.Property = fileParams;
        }
        this.downloadListener = (fileParams) => {
            let res = observablePropFactory.getObservable(fileParams.fileId);
            res.Property = fileParams;
        }
    }

    componentWillMount () {
        DeviceEventEmitter.addListener("uploadFile", this.uploadListener);
        DeviceEventEmitter.addListener("downloadFile", this.downloadListener);

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { this.props.disableSelectionMode(); });
    }
    
    componentWillUnmount () {
        DeviceEventEmitter.removeListener("uploadFile", this.uploadListener);
        DeviceEventEmitter.removeListener("downloadFile", this.downloadListener);
        observablePropFactory.clean();

        this.keyboardDidShowListener.remove();
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

            let re = /\/(\w||[\-\s])+\..+$/i;
            let result = path.match(re);
            let name = "uploading...";

            if(result) {
                name = result[0].slice(1);
            }

            let tempFile = { name, fileId: path, created: new Date().toLocaleString() };
            this.props.uploadFileStart(this.props.openedBucketId, new ListItemModel(new FileModel(tempFile), false, true));

            const observer = observablePropFactory.getObservable(filePickerResponse.path);
            observer.addListener({ id: filePickerResponse.path + this.props.openedBucketId, callback: (param) => { 
                if(this.props.openedBucketId === param.bucketId)
                    this.props.updateFileUploadProgress(param.bucketId, param.filePath, param.progress, param.filePointer);
            }});

            let uploadFileResponse = await StorjLib.uploadFile(this.props.openedBucketId, path);

            if(uploadFileResponse.isSuccess) {
                this.props.uploadFileSuccess(this.props.openedBucketId, new ListItemModel(uploadFileResponse.result), path);
            } else {
                this.props.uploadFileError(this.props.openedBucketId, path);
            }
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
            this.props.downloadFileSuccess(this.props.openedBucketId, fileId);
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
        let response = await  StorjLib.deleteFile(bucketId, fileId);
        
        if(response.isSuccess) {
            this.props.deleteFile(bucketId, fileId);
        }
    }

    deleteSelectedFiles() {
        this.props.fileListModels.forEach(fileEntry => {
            fileEntry.files.forEach(fileItem => {
                if(fileItem.isSelected)
                    this.deleteFile(fileEntry.bucketId, fileItem.getId());
            });
        });
    }

    async createBucket(bucketName) {
        let createBucketResponse = await StorjLib.createBucket(bucketName);
    
        if(createBucketResponse.isSuccess) {
            this.props.createBucket(new ListItemModel(createBucketResponse.result)) ;
        }
    }

    async deleteBucket(bucket) {
        let result = await StorjLib.deleteBucket(bucket.getId());

        if(result.isSuccess) {
            this.props.deleteBucket(bucket);
        }
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

    deleteBuckets() {
        this.getSelectedBuckets().forEach(item => {
            this.deleteBucket(item);
        });

        if(this.props.isSingleItemSelected)
            this.props.disableSelectionMode();
    }

    async getBuckets() {
        try {
            let buckets = await StorjLib.getBuckets();

            this.props.getBuckets(buckets.map((bucket => new ListItemModel(bucket))));
        } catch(e) {
            //Eror callback
            console.log('errorName: ' + e.name, "// errorMessage: " + e.message, "// errorCode: " + e.code);
        }
    }

    static navigationOptions = {
        header: null
    };

    render() {
        const index = this.props.bucketsScreenNavReducer.index;
        const routes = this.props.bucketsScreenNavReducer.routes;

        return(
            <MainComponent
                bucketScreenRouteName = { routes[index].routeName }
                openedBucketId = { this.props.openedBucketId }
                createBucket = { this.createBucket.bind(this) }
                hideCreateBucketInput = { this.props.hideCreateBucketInput }
                tapBarActions = { this.tapBarActions } 
                selectionModeActions = { this.selectionModeActions }
                openedBucketActions = { this.openedBucketActions }
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
        fileListModels: state.filesReducer.fileListModels,
        openedBucketId: state.mainReducer.openedBucketId,
        isSelectionMode: state.mainReducer.isSelectionMode, 
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        isActionBarShown: state.mainReducer.isActionBarShown,
        buckets: state.mainReducer.buckets,
        isCreateBucketInputShown: state.mainReducer.isCreateBucketInputShown,
        isFirstSignIn: state.mainReducer.isFirstSignIn,
        isLoading: state.mainReducer.isLoading
    };
}
function mapDispatchToProps(dispatch) { return bindActionCreators({ ...mainContainerActions, ...mainContainerFileActions }, dispatch); };

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);