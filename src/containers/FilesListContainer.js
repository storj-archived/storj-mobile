import { BackHandler, Platform, DeviceEventEmitter, Animated } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketNavigateBack, dashboardNavigateBack, openImageViewer } from '../reducers/navigation/navigationActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { listUploadingFiles, listFiles } from "../reducers/asyncActions/fileActionsAsync";
import StorjModule from '../utils/StorjModule';
import ServiceModule from '../utils/ServiceModule';
import ListItemModel from '../models/ListItemModel';
import FileModel from '../models/FileModel';
import FilesListComponent from '../components/FilesListComponent';
import SyncModule from '../utils/SyncModule';

class FilesListContainer extends Component {
    constructor(props) {
        super(props);

        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
    }

    getData() { 
        return this.props.fileListModels.concat(this.props.uploadingFileListModels)
                                        .filter(file => file.entity.bucketId === this.props.openedBucketId);
    }

    async componentWillMount() {        
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
        
        this.props.setLoading();
        await this.props.listFilesAsync(this.bucketId);
        ServiceModule.getFiles(this.bucketId);  
    }

    componentWillUnmount() {
        if(Platform.OS === "android") {
            BackHandler.removeEventListener("hardwarebackPress", this.onHardwareBackPress);
        }
    }

    async cancelDownload(file) {

        let cancelDownloadResponse = await StorjModule.cancelDownload(file.fileRef);

        if(cancelDownloadResponse.isSuccess) {
            this.props.fileDownloadCanceled(this.props.openedBucketId, file.getId());
        }
    }

    async cancelUpload(file) {        
        let cancelUploadResponse = await StorjModule.cancelUpload(file.fileRef);

        if(cancelUploadResponse.isSuccess) {
            this.props.fileUploadCanceled(this.props.openedBucketId, file.getId());
        }
    }

    onHardwareBackPress() {
        if(this.props.isLoading)
            return;

        const index = this.props.mainNavReducer.index;
        const routes = this.props.mainNavReducer.routes;

        if(routes[index].routeName === "ImageViewerScreen") 
            return;

        if (this.props.isSelectionMode || 
            this.props.isSingleItemSelected || 
            this.props.isActionBarShown) 
                return;        

        this.props.closeBucket();
        
        this.props.bucketNavigateBack();
    }

    onPress(file) {
        if(file.entity.isDownloaded) {
            this.props.openImageViewer(file.getId(), file.entity.localPath, file.entity.bucketId);
        }
    }

    render() {
        return(
            <FilesListComponent
                activeScreen = { this.props.activeScreen }  
                setSelectionId = { this.props.screenProps.setSelectionId }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (params) => { this.onPress(params); } }
                cancelDownload = { (params) => { this.cancelDownload(params); } }
                cancelUpload = { (params) => { this.cancelUpload(params); } }
                bucketId = { this.props.openedBucketId }
                openedBucketId = { this.props.openedBucketId }
                dashboardBucketId = { this.props.dashboardBucketId }
                data = { this.getData() }
                onSingleItemSelected = { this.props.onSingleItemSelected }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                deselectFile = { this.props.deselectFile }
                selectFile = { this.props.selectFile }
                renewFileList = { () => { 
                    ServiceModule.getFiles(this.props.openedBucketId); 
                    this.props.listUploadingFilesAsync(this.props.openedBucketId); 
                } }/>
        );
    }
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName;

    return {
        mainNavReducer: state.navReducer,
        openedBucketId: state.mainReducer.openedBucketId,
        dashboardBucketId: state.mainReducer.dashboardBucketId,
        isActionBarShown: state.mainReducer.isActionBarShown,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        fileListModels: state.filesReducer.fileListModels,
        uploadingFileListModels: state.filesReducer.uploadingFileListModels,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,
        downloadedFileListModels: state.filesReducer.downloadedFileListModels,
        selectedItemId: state.mainReducer.selectedItemId,
        activeScreen: currentScreenName
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({ bucketNavigateBack, dashboardNavigateBack, openImageViewer, ...filesListContainerMainActions, ...filesListContainerFileActions }, dispatch),
        listUploadingFilesAsync: (bucketId) => { dispatch(listUploadingFiles(bucketId)); },
        listFilesAsync: async (bucketId) => { return await dispatch(listFiles(bucketId)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesListContainer);