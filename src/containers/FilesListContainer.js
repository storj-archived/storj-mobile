import { BackHandler, Platform, DeviceEventEmitter, Animated } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketNavigateBack, dashboardNavigateBack, openImageViewer } from '../reducers/navigation/navigationActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import StorjModule from '../utils/StorjModule';
import ServiceModule from '../utils/ServiceModule';
import ListItemModel from '../models/ListItemModel';
import FileModel from '../models/FileModel';
import FilesListComponent from '../components/FilesListComponent';

class FilesListContainer extends Component {
    constructor(props) {
        super(props);

        this.serviceListener = null;
        this.bucketId = props.navigation.state.params.bucketId;
        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
    }

    componentWillMount() {
        if(Platform.OS === "android") {
            BackHandler.addEventListener("hardwarebackPress", this.onHardwareBackPress);
        }        

        Animated.timing(
            this.props.screenProps.animatedScrollValue,
            {
              toValue: 0,
              useNativeDriver: true
            }
        ).start();        

        this.serviceListener = DeviceEventEmitter.addListener("EVENT_FILES_UPDATED", this.onGetData.bind(this));       
        
        ServiceModule.getFiles(this.bucketId);    
    }

    componentWillUnmount() {
        if(Platform.OS === "android") {
            BackHandler.removeEventListener("hardwarebackPress", this.onHardwareBackPress);
        }

        if(this.serviceListener) this.serviceListener.remove();
    }

    async onGetData() {
        this.props.setLoading();

        let filesResponse = await ServiceModule.listFiles(this.bucketId);

        if(filesResponse.isSuccess) {
            let files = JSON.parse(filesResponse.result).map((file) => {
                return new ListItemModel(new FileModel(file));
            });                    

            this.props.listFiles(this.bucketId, files);
        }

        ServiceModule.getFilesWorking = false;
        this.props.unsetLoading();
    }

    async cancelDownload(file) {

        let cancelDownloadResponse = await StorjModule.cancelDownload(file.fileRef);

        if(cancelDownloadResponse.isSuccess) {
            this.props.fileDownloadCanceled(this.bucketId, file.getId());
        }
    }

    async cancelUpload(file) {        
        let cancelUploadResponse = await StorjModule.cancelUpload(file.fileRef);

        if(cancelUploadResponse.isSuccess) {
            this.props.fileUploadCanceled(this.bucketId, file.getId());
        }
    }

    onHardwareBackPress() {
        if(this.props.isLoading)
            return;

        const index = this.props.mainNavReducer.index;
        const routes = this.props.mainNavReducer.routes;

        if(routes[index].routeName === "ImageViewerScreen") 
            return;

        if(this.props.isSelectionMode 
        || this.props.isSingleItemSelected 
        || this.props.isActionBarShown) {

            return;
        }

        this.props.closeBucket();

        if(this.props.screenProps.defaultRoute == 'DashboardScreen') {
            this.props.dashboardNavigateBack();
        } else {
            this.props.bucketNavigateBack();
        }
    }

    onPress(params) {
        let downloadedFileListModel = this.props.downloadedFileListModels.find(item => item.bucketId === this.bucketId);

        if(!downloadedFileListModel) 
            return;
        
        let downloadedFile = downloadedFileListModel.files.find(file => { 
            return file.id === params.bucketId 
        });

        if(downloadedFile) {
            this.props.openImageViewer(downloadedFile.id, downloadedFile.path, downloadedFileListModel.bucketId);
        }
    }

    

    render() {
        let data = getFilesFormFileModelList(this.props.fileListModels, this.bucketId);
        let uploadingData = getFilesFormFileModelList(this.props.uploadingFileListModels, this.bucketId);

        return(
            <FilesListComponent
                setSelectionId = { this.props.screenProps.setSelectionId }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (params) => { this.onPress(params); } }
                cancelDownload = { (params) => { this.cancelDownload(params); } }
                cancelUpload = { (params) => { this.cancelUpload(params); } }
                bucketId = { this.bucketId }
                data = { data.concat(uploadingData) }
                onSingleItemSelected = { this.props.onSingleItemSelected }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                deselectFile = { this.props.deselectFile }
                selectFile = { this.props.selectFile }
                renewFileList = { () => ServiceModule.getFiles(this.bucketId) } />
        );
    }
}

function mapStateToProps(state) {
    return {
        mainNavReducer: state.navReducer,
        isActionBarShown: state.mainReducer.isActionBarShown,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        fileListModels: state.filesReducer.fileListModels,
        uploadingFileListModels: state.filesReducer.uploadingFileListModels,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,
        downloadedFileListModels: state.filesReducer.downloadedFileListModels,
        selectedItemId: state.mainReducer.selectedItemId
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ bucketNavigateBack, dashboardNavigateBack, openImageViewer, ...filesListContainerMainActions, ...filesListContainerFileActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesListContainer);

function getFilesFormFileModelList(fileModelList, bucketId) {
    let files = [];

    fileModelList.forEach(element => {
        if(element.bucketId === bucketId) {
            files = element.files;
        }
    });

    return files;
}