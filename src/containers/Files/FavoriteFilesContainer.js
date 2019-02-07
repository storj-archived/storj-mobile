import React from 'react';
import { Animated } from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openImageViewer, openFilePreview } from '../../reducers/navigation/navigationActions';
import { myPicturesListContainerMainActions} from '../../reducers/mainContainer/mainReducerActions';
import { dashboardContainerActions } from '../../reducers/mainContainer/mainReducerActions';
import { dashboardContainerBucketActions } from '../../reducers/mainContainer/Buckets/bucketReducerActions';
import { filesListContainerMainActions } from '../../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions, selectFiles, deselectFiles } from '../../reducers/mainContainer/Files/filesReducerActions';
import { dashboardNavigateBack, navigateToDashboardFilesScreen, navigateBack } from '../../reducers/navigation/navigationActions';
import { listFiles, listUploadingFiles } from "../../reducers/asyncActions/fileActionsAsync";
import filesActions from '../../reducers/mainContainer/Files/filesReducerActions';
import BaseFilesListContainer from "./BaseFilesListContainer";
import headerFilesListBinder from "../../viewBinders/headerFilesListBinder";

/**
 * Container for favorite files screen on dashboard
 */
class FavoriteFilesContainer extends BaseFilesListContainer {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
        /**
         * FileListComponent with header that is binded to 
         * default props of this FileListContainer
         */
        this.HeaderFilesListComponent = headerFilesListBinder.call(this);
        
        this.navigateBack = this.navigateBack.bind(this);
        this.deselectFiles = this.deselectFiles.bind(this);
        this.selectAll = this.selectAll.bind(this);
    }

    /**
     * Overriden method from BaseFileListContainer
     * selects starred all files and uploadingFiles
     * @returns {ListItemModel<FileModel>[]} ListItemModels initialized with FileModel
     */
    getData() { 
        return this.props.fileListModels.concat(this.props.uploadingFileListModels)
                                        .filter(file => file.getStarred() === true);
    }

    /**
     * Action for clearing selection on dashboard favorite files screen,
     * also disables selection mode for closing selection header
     */
    deselectFiles() {
        this.props.deselectFiles();
        this.props.disableSelectionMode();
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

    getDataForSelection() {
        let data = this.getData().slice();

        if(this.props.searchSubSequence) {
            return data.filter(file => file.entity.name.toLowerCase().includes(this.props.searchSubSequence.toLowerCase()))
        }

        return data;
    }

    selectAll() {
        this.props.selectFiles(this.getDataForSelection());
    }

    render() {
        let data = this.getData();

        return (
            <this.HeaderFilesListComponent
                lastSync = { this.props.lastSync }
                isLoading = { false }                            
                data = { data }
                animatedScrollValue = { this.animatedScrollValue }
                isFilesScreen = { true }
                searchIndex = { 4 }
                navigateBack = { this.navigateBack }
                selectAll = { this.selectAll  }
                deselectAll = { this.deselectFiles }
                searchSubSequence = { this.props.searchSubSequence } />
        );
    }
}

function mapStateToProps(state) {
    let routes = state.dashboardScreenNavReducer.routes;
    let index = state.dashboardScreenNavReducer.index;
    let currentScreenName = routes[index].routeName;  

    return {
        lastSync: state.settingsReducer.lastSync,
        buckets: state.bucketReducer.buckets,
        fileListModels: state.filesReducer.fileListModels,
        uploadingFileListModels: state.filesReducer.uploadingFileListModels,
        selectedItemId: state.mainReducer.selectedItemId,
        mainNavReducer: state.navReducer,
        dashboardBucketId: state.mainReducer.dashboardBucketId,
        isActionBarShown: state.mainReducer.isActionBarShown,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,
        activeScreen: state.mainReducer.activeScreen,
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
        openFilePreview,
        ...myPicturesListContainerMainActions, 
        ...filesActions,...dashboardContainerActions, 
        ...dashboardContainerBucketActions,
        ...filesListContainerMainActions, 
        ...filesListContainerFileActions, 
        dashboardNavigateBack,
        navigateToDashboardFilesScreen,
        navigateBack,
        selectFiles,
        deselectFiles,
        listFilesAsync: (bucketId) => dispatch(listFiles(bucketId)),
        listUploadingFilesAsync: (bucketId) => dispatch(listUploadingFiles(bucketId))
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteFilesContainer);