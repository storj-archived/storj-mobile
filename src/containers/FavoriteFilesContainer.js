import React, { Component } from 'react';
import { Animated } from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openImageViewer } from '../reducers/navigation/navigationActions';
import { myPicturesListContainerMainActions, getPicturesBucketId } from '../reducers/mainContainer/mainReducerActions';
import { dashboardContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { dashboardContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { dashboardNavigateBack, navigateToDashboardFilesScreen, navigateBack } from '../reducers/navigation/navigationActions';
import filesActions from '../reducers/mainContainer/Files/filesReducerActions';
import BaseFilesListContainer from "../containers/BaseFilesListContainer";
import headerFilesListBinder from "../viewBinders/headerFilesListBinder";
import PropTypes from 'prop-types';

class FavoriteFilesContainer extends BaseFilesListContainer {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
        this.HeaderFilesListComponent = headerFilesListBinder.call(this);
    }

    getData() { 
        return this.props.fileListModels.concat(this.props.uploadingFileListModels)
                                        .filter(file => file.getStarred() === true);
    }

    navigateBack() {
        this.props.clearSearch(3);
        this.props.dashboardNavigateBack();
        this.props.disableSelectionMode();
        this.props.setDashboardBucketId(null);
    }

    render() {
        let data = this.getData();

        return (
            <this.HeaderFilesListComponent
                isLoading = { false }                            
                data = { data }
                animatedScrollValue = { this.animatedScrollValue }
                isFilesScreen = { true }
                searchIndex = { 3 }
                navigateBack = { this.navigateBack.bind(this) } />
        );
    }
}

function mapStateToProps(state) {
    let routes = state.dashboardScreenNavReducer.routes;
    let index = state.dashboardScreenNavReducer.index;
    let currentScreenName = routes[index].routeName;  

    return {
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
        searchSubSequence: state.mainReducer.starredSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  
        openImageViewer,
        ...myPicturesListContainerMainActions, 
        ...filesActions,...dashboardContainerActions, 
        ...dashboardContainerBucketActions,
        ...filesListContainerMainActions, 
        ...filesListContainerFileActions, 
        dashboardNavigateBack,
        navigateToDashboardFilesScreen,
        navigateBack
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteFilesContainer);