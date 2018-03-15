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
import SyncModule from '../utils/SyncModule';

class FilesListContainer extends Component {
    constructor(props) {
        super(props);

        this.bucketId = props.navigation.state.params.bucketId;
        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
    }

    getData() {
        return this.props.fileListModels.concat(this.props.uploadingFileListModels).filter(file => file.entity.bucketId === this.props.openedBucketId);
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
        
        if (this.props.screenProps.defaultRoute !== "DashboardScreen") {
            ServiceModule.getFiles(this.bucketId);  
        }   
    }

    componentWillUnmount() {
        if(Platform.OS === "android") {
            BackHandler.removeEventListener("hardwarebackPress", this.onHardwareBackPress);
        }
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
        let downloadedFile = this.props.downloadedFileListModels.find(file => { 
            return file.id === params.bucketId;
        });

        if(downloadedFile) {
            this.props.openImageViewer(downloadedFile.id, downloadedFile.path, downloadedFile.bucketId);
        }
    }

    render() {
        return(
            <FilesListComponent
                setSelectionId = { this.props.screenProps.setSelectionId }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (params) => { this.onPress(params); } }
                cancelDownload = { (params) => { this.cancelDownload(params); } }
                cancelUpload = { (params) => { this.cancelUpload(params); } }
                bucketId = { this.bucketId }
                data = { this.getData() }
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
        openedBucketId: state.mainReducer.openedBucketId,
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