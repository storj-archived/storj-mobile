import React, { Component } from 'react';
import {
    Animated
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import { myPicturesListContainerMainActions, getPicturesBucketId, dashboardContainerActions, filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { dashboardContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { dashboardNavigateBack, navigateToDashboardFilesScreen, navigateBack, openImageViewer, openFilePreview } from '../reducers/navigation/navigationActions';
import filesActions from '../reducers/mainContainer/Files/filesReducerActions';
import BaseFilesListContainer from '../containers/BaseFilesListContainer';
import headerFilesListBinder from "../viewBinders/headerFilesListBinder";
import PropTypes from 'prop-types';

/** 
 * Appears after clicking on favorite item in dashboard
*/
class DashboardFilesListContainer extends BaseFilesListContainer {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
        /**
         * FileListComponent with header that is binded to 
         * default props of this FileListContainer
         */
        this.HeaderFilesListComponent = headerFilesListBinder.call(this);
    }

    /** 
     * Set initial data upload from Storj Network when screen is loaded
     */
    componentWillMount() {            
        this.onRefresh();
    } 

    shouldComponentUpdate(nextProps) {
        return nextProps.activeScreen === "DashboardScreen";
    }

    /**      
     * Navigate Back callback. Cleaning search state in header, 
     * disables selecion mode and closes opened in dashboard screen bucket.
    */
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
            <this.HeaderFilesListComponent
                lastSync = { this.props.lastSync }
                isLoading = { this.props.loadingStack.includes(this.props.bucketId) }                            
                data = { data }
                animatedScrollValue = { this.animatedScrollValue }
                isFilesScreen = { true }
                searchIndex = { 4 }
                navigateBack = { this.navigateBack.bind(this) }
                selectAll = { this.props.screenProps.selectAll }
                deselectAll = { this.props.screenProps.deselectAll }
                searchSubSequence = { this.props.searchSubSequence } />
        );
    }
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName; 

    return {
        lastSync: state.settingsReducer.lastSync,
        loadingStack: state.mainReducer.loadingStack,
        buckets: state.bucketReducer.buckets,
        fileListModels: state.filesReducer.fileListModels,
        selectedItemId: state.mainReducer.selectedItemId,        
        bucketId: state.mainReducer.dashboardBucketId,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        uploadingFileListModels: state.filesReducer.uploadingFileListModels,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,
        sortingMode: state.mainReducer.sortingMode,        
        activeScreen: currentScreenName,        
        searchSubSequence: state.mainReducer.dashboardFilesSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  
            openImageViewer, 
            openFilePreview,
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFilesListContainer);

DashboardFilesListContainer.propTypes = {
    activeScreen: PropTypes.string,
    searchSubSequence: PropTypes.string,
    sortingMode: PropTypes.string,
    setSelectionId: PropTypes.func,
    selectedItemId: PropTypes.string,
    isGridViewShown: PropTypes.bool,
    bucketId: PropTypes.string,
    onSingleItemSelected: PropTypes.func,
    animatedScrollValue: PropTypes.bool,
    enableSelectionMode: PropTypes.func,
    disableSelectionMode: PropTypes.func,    
    isSingleItemSelected: PropTypes.bool,
    deselectFile: PropTypes.func,
    selectFile: PropTypes.func,    
    fileListModels: PropTypes.array,    
    isLoading: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,       
    screenProps: PropTypes.object,    
    uploadingFileListModels: PropTypes.array
};