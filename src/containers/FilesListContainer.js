import { BackHandler, Platform, DeviceEventEmitter, Animated } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketNavigateBack, dashboardNavigateBack, openImageViewer } from '../reducers/navigation/navigationActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { listUploadingFiles, listFiles } from "../reducers/asyncActions/fileActionsAsync";
import ServiceModule from '../utils/ServiceModule';
import FilesListComponent from '../components/FilesListComponent';
import BaseFileListContainer from '../containers/BaseFileListContainer';

/** 
 * Files screen, base screen, appears after opening bucket on bucket screen
*/
class FilesListContainer extends BaseFileListContainer {
    constructor(props) {
        super(props);

        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
    }    

    /** 
     * Set initial data upload from Storj Network when screen is loaded, 
     * resets header animation and handling hardware back button click on Android devices
    */
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
        
        this.props.pushLoading(this.props.bucketId);
        await this.props.listFilesAsync(this.props.bucketId);
        await this.props.listUploadingFilesAsync(this.props.bucketId);
        ServiceModule.getFiles(this.props.bucketId);  
    }

    /**      
     * Cleaning all event listeners
    */
    componentWillUnmount() {
        if(Platform.OS === "android") {
            BackHandler.removeEventListener("hardwarebackPress", this.onHardwareBackPress);
        }
    }

    /**      
     * Hardware Back Press callback. Closes bucket and navigating to bucket screen
    */
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

    render() {
        let data = this.getData();

        return(
            <FilesListComponent
                isLoading = { this.props.loadingStack.includes(this.props.bucketId) }
                activeScreen = { this.props.activeScreen }  
                setSelectionId = { this.props.screenProps.setSelectionId }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (params) => { this.onPress(params); } }
                cancelDownload = { (params) => { this.cancelDownload(params); } }
                cancelUpload = { (params) => { this.cancelUpload(params); } }
                bucketId = { this.props.bucketId }                
                dashboardBucketId = { this.props.dashboardBucketId }
                data = { data }
                onSingleItemSelected = { this.props.onSingleItemSelected }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                deselectFile = { this.props.deselectFile }
                selectFile = { this.props.selectFile }
                sortingMode = { this.props.sortingMode }
                searchSubSequence = { this.props.searchSubSequence }
                onRefresh = { this.onRefresh.bind(this) } />
        );
    }
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName;

    return {
        loadingStack: state.mainReducer.loadingStack,
        mainNavReducer: state.navReducer,
        bucketId: state.mainReducer.openedBucketId,
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
        activeScreen: currentScreenName,
        sortingMode: state.mainReducer.sortingMode,
        searchSubSequence: state.mainReducer.filesSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({ bucketNavigateBack, dashboardNavigateBack, openImageViewer, ...filesListContainerMainActions, ...filesListContainerFileActions }, dispatch),
        listUploadingFilesAsync: async (bucketId) => { await dispatch(listUploadingFiles(bucketId)); },
        listFilesAsync: async (bucketId) => { return await dispatch(listFiles(bucketId)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesListContainer);