import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ListComponent from '../components/ListComponent';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import { openImageViewer } from '../reducers/navigation/navigationActions';
import { myPicturesListContainerMainActions, getPicturesBucketId } from '../reducers/mainContainer/mainReducerActions';
import { dashboardContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { dashboardContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { dashboardNavigateBack, navigateToDashboardFilesScreen, navigateBack } from '../reducers/navigation/navigationActions';
import filesActions from '../reducers/mainContainer/Files/filesReducerActions';
import ServiceModule from '../utils/ServiceModule';
import { TYPES } from '../utils/constants/typesConstants';
import { getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';
import EmpyBucketComponent from '../components/EmpyBucketComponent';
import { listUploadingFiles, listFiles } from "../reducers/asyncActions/fileActionsAsync";
import BaseFileListContainer from '../containers/BaseFileListContainer';

class DashboardFileListContainer extends BaseFileListContainer {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    componentWillMount() {            
        this.props.pushLoading(this.props.bucketId);
        ServiceModule.getFiles(this.props.bucketId);  
    }    

    getArraySelectedCount(array) {
        return array.filter(item => item.isSelected).length;
    }

    getSelectedItemsCount() {        
        return this.getArraySelectedCount(this.props.buckets.concat(this.props.fileListModels));
    }    

    navigateBack() {
        this.props.clearSearch(4);
        this.props.dashboardNavigateBack();
        this.props.disableSelectionMode();
        this.props.setDashboardBucketId(null);
    }

    render() {
        let data = this.getData();
        let isLoading = this.props.loadingStack.includes(this.props.bucketId);
        
        return (
            <View style = { styles.mainContainer }>
                {
                    data.length === 0 && this.props.bucketId !== null && !isLoading ?
                        <EmpyBucketComponent />
                        : <ListComponent
                            activeScreen = { this.props.screenName }
                            searchSubSequence = { this.props.searchSubSequence }
                            screens = { "DashboardScreen" }                    
                            contentWrapperStyle = { styles.contentWrapper }
                            setSelectionId = { this.props.setSelectionId }
                            selectedItemId = { this.props.selectedItemId }
                            cancelDownload = { (params) => { this.cancelDownload(params); }}
                            cancelUpload = { (params) => { this.cancelUpload(params); }}
                            isGridViewShown = { this.props.isGridViewShown }
                            onPress = { (params) => { this.onPress(params); } }
                            onRefresh = { this.onRefresh.bind(this) }
                            itemType = { TYPES.REGULAR_FILE }
                            bucketId = { this.props.bucketId }
                            onSingleItemSelected = { this.props.onSingleItemSelected }                    
                            animatedScrollValue = { this.props.animatedScrollValue }
                            enableSelectionMode = { this.props.enableSelectionMode }
                            disableSelectionMode = { this.props.disableSelectionMode }
                            isSelectionMode = { this.props.isSelectionMode }
                            isSingleItemSelected = { this.props.isSingleItemSelected }
                            deselectItem = { this.props.deselectFile }
                            selectItem = { this.props.selectFile }
                            data = { data }   
                            sortingMode = { this.props.sortingMode }
                            listItemIcon = { require('../images/Icons/FileListItemIcon.png') }
                            starredGridItemIcon = { require('../images/Icons/GridStarredFile.png') }
                            starredListItemIcon = { require('../images/Icons/ListStarredFile.png') } />
                }

                <LoadingComponent isLoading = { isLoading } /> 

                <BucketsScreenHeaderComponent
                    setSearch = { this.props.setSearch }
                    clearSearch = { this.props.clearSearch }
                    searchIndex = { 4 }  
                    setDashboardBucketId = { this.props.setDashboardBucketId }
                    isFilesScreen = { true }
                    buckets = { this.props.buckets }
                    screenName = { this.props.screenName }
                    selectItem = { this.props.selectItem }
                    showOptions = { this.props.screenProps.showOptions }
                    navigateBack = { () => { this.navigateBack() } }
                    deselectItem = { this.props.deselectItem }     
                    isSelectionMode = { this.props.isSelectionMode }
                    openedBucketId = { this.props.selectedBucketId }
                    animatedScrollValue = { this.animatedScrollValue }
                    enableSelectionMode = { this.props.enableSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    selectedItemsCount = { this.getSelectedItemsCount() }  
                    onSingleItemSelected = { this.props.onSingleItemSelected }  
                    isSingleItemSelected = { this.props.isSingleItemSelected } />
            </View>
        )
    }
}

const LoadingComponent = (props) => {
    return (
        <View style = { styles.loadingComponentContainer }>
            <ActivityIndicator animating = { props.isLoading } size = { 'large' } color = { 'blue' } />
        </View>
    ); 
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName; 
    let routes = state.dashboardScreenNavReducer.routes;

    return {
        loadingStack: state.mainReducer.loadingStack,
        buckets: state.bucketReducer.buckets,
        fileListModels: state.filesReducer.fileListModels,
        selectedItemId: state.mainReducer.selectedItemId,
        mainNavReducer: state.navReducer,
        bucketId: state.mainReducer.dashboardBucketId,
        isActionBarShown: state.mainReducer.isActionBarShown,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        uploadingFileListModels: state.filesReducer.uploadingFileListModels,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,
        downloadedFileListModels: state.filesReducer.downloadedFileListModels,
        sortingMode: state.mainReducer.sortingMode,
        isFirstSignIn: state.mainReducer.isFirstSignIn,
        defaultRoute: routes[0].routeName,
        screenName: currentScreenName,
        selectedBucketId: state.mainReducer.dashboardBucketId,
        searchSubSequence: state.mainReducer.dashboardFilesSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({  
            openImageViewer, 
            ...myPicturesListContainerMainActions, 
            ...filesActions,
            ...dashboardContainerActions, 
            ...dashboardContainerBucketActions,
            ...filesListContainerMainActions, 
            ...filesListContainerFileActions, 
            dashboardNavigateBack,
            navigateToDashboardFilesScreen,
            navigateBack
        }, dispatch),
        listUploadingFilesAsync: async (bucketId) => { await dispatch(listUploadingFiles(bucketId)); },
        listFilesAsync: async (bucketId) => { return await dispatch(listFiles(bucketId)); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFileListContainer);

DashboardFileListContainer.propTypes = {
    setSelectionId: PropTypes.func,
    selectedItemId: PropTypes.string,
    cancelDownload: PropTypes.bool,
    cancelUpload: PropTypes.bool,
    isGridViewShown: PropTypes.bool,
    bucketId: PropTypes.string,
    onSingleItemSelected: PropTypes.func,
    animatedScrollValue: PropTypes.bool,
    enableSelectionMode: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    deselectFile: PropTypes.func,
    selectFile: PropTypes.func,
    closeBucket: PropTypes.func,
    deleteFile: PropTypes.func,
    downloadFileError: PropTypes.func,
    downloadFileSuccess: PropTypes.func,
    downloadedFileListModels: PropTypes.array,
    fileDownloadCanceled: PropTypes.func,
    fileListModels: PropTypes.array,
    fileUploadCanceled: PropTypes.func,    
    isActionBarShown: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    listFiles: PropTypes.func,
    mainNavReducer: PropTypes.object,
    navigation: PropTypes.object,
    openBucket: PropTypes.func,
    openImageViewer: PropTypes.func,
    screenProps: PropTypes.object,
    setLoading: PropTypes.func,
    listUploadingFiles: PropTypes.func,
    unsetLoading: PropTypes.func,
    updateFileDownloadProgress: PropTypes.func,
    updateFileUploadProgress: PropTypes.func,
    uploadFileError: PropTypes.func,
    uploadFileStart: PropTypes.func,
    uploadFileSuccess: PropTypes.func,
    uploadingFileListModels: PropTypes.array
};


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentWrapper: {
        paddingTop: getHeight(58),
        paddingBottom: getHeight(60)
    },
    loadingComponentContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: getHeight(80),
        height: getHeight(60)
    }
});