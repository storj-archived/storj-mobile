import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Animated
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
import StorjModule from '../utils/StorjModule';
import ListItemModel from '../models/ListItemModel';
import FileModel from '../models/FileModel';
import ServiceModule from '../utils/ServiceModule';
import { TYPES } from '../utils/constants/typesConstants';
import { getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';
import EmpyBucketComponent from '../components/EmpyBucketComponent';

class DashboardFileListContainer extends Component {
    constructor(props) {
        super(props);

        this.data = [];
        this.animatedScrollValue = new Animated.Value(0);
    }

    getData() {        
        this.data = this.props.files.
                        concat(this.props.uploadingFileListModels).
                        filter(file => file.entity.bucketId === this.props.dashboardBucketId);

        return this.data;
    }

    getArraySelectedCount(array) {
        return array.filter(item => item.isSelected).length;
    }

    getSelectedItemsCount() {        
        return this.getArraySelectedCount(this.props.buckets.concat(this.props.files));
    }

    onPress(file) {        
        if(file.entity.isDownloaded) {
            this.props.openImageViewer(file.getId(), file.entity.localPath, file.entity.bucketId);
        }
    }

    navigateBack() {
        this.props.dashboardNavigateBack();
        this.props.disableSelectionMode();
        this.props.setDashboardBucketId(null);
    }

    render() {
        let data = this.getData();

        return (
            <View style = { styles.mainContainer }>
                {
                    data.length === 0 && this.props.dashboardBucketId !== null ? 
                        <EmpyBucketComponent />
                        : <ListComponent
                            activeScreen = { this.props.screenName }
                            searchSubSequence = { this.props.searchSubSequence }
                            screens = { "DashboardScreen" }                    
                            contentWrapperStyle = { styles.contentWrapper }
                            setSelectionId = { this.props.setSelectionId }
                            selectedItemId = { this.props.selectedItemId }
                            cancelDownload = { this.props.cancelDownload }
                            cancelUpload = { this.props.cancelUpload }
                            isGridViewShown = { this.props.isGridViewShown }
                            onPress = { (params) => { this.onPress(params); } }
                            onRefresh = { () => ServiceModule.getFiles(this.props.dashboardBucketId) }
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

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName; 
    let routes = state.dashboardScreenNavReducer.routes;

    return {
        buckets: state.bucketReducer.buckets,
        files: state.filesReducer.fileListModels,
        selectedItemId: state.mainReducer.selectedItemId,
        mainNavReducer: state.navReducer,
        dashboardBucketId: state.mainReducer.dashboardBucketId,
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
    return bindActionCreators({  
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
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFileListContainer);

DashboardFileListContainer.propTypes = {
    setSelectionId: PropTypes.func,
    selectedItemId: PropTypes.string,
    cancelDownload: PropTypes.bool,
    cancelUpload: PropTypes.bool,
    isGridViewShown: PropTypes.bool,
    dashboardBucketId: PropTypes.string,
    bucketId: PropTypes.bool,
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
    files: PropTypes.array,
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
    }
});