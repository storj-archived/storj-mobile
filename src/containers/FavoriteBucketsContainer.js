import React, { Component } from 'react';
import { Animated } from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dashboardContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { bucketsListContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { bucketsListContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { dashboardNavigateBack, navigateBack } from '../reducers/navigation/navigationActions';
import { getShortBucketName } from "../utils/fileUtils";
import filesActions from '../reducers/mainContainer/Files/filesReducerActions';
import BaseListContainer from "../containers/BaseListContainer";
import HeaderBucketsListComponent from "../components/HeaderBucketsListComponent";
import PropTypes from 'prop-types';

class FavoriteBucketsContainer extends BaseListContainer {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    getData() { 
        return this.props.buckets.filter(file => file.getStarred() === true);
    }

    _onSelectionPress(item) {
        if(item.isSelected)
            this.props.deselectBucket(item);
        else
            this.props.selectBucket(item);
    }

    _onPress(item) {
        /* this.props.openBucket(item.getId());
        this.props.navigateToFilesScreen(item.getId());   */  
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
            <HeaderBucketsListComponent
                isLoading = { this.props.isLoading }
                data = { data }
                animatedScrollValue = { this.animatedScrollValue }
                getItemSize = { () => {} }
                getBucketName = { getShortBucketName }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (item) => { this.onPress(item); } }
                onLongPress = { (item) => { this.onLongPress(item); } }
                onDotsPress = { (item) => { this.onDotsPress(item); } }
                onCancelPress = { (item) => { this.onCancelPress(item); } }                             
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                sortingMode = { this.props.sortingMode }
                searchSubSequence = { this.props.searchSubSequence }
                onRefresh = { () => {} }

                isFilesScreen = { true }
                searchIndex = { 3 }
                navigateBack = { this.navigateBack.bind(this) }
                buckets = { [] }
                setSearch = { this.props.setSearch }
                clearSearch = { this.props.clearSearch }
                disableSelectionMode = { this.props.disableSelectionMode }
                showOptions = { this.props.screenProps.showOptions }
                getSelectedFilesCount = { this.getSelectedItemsCount(data) } />
        );
    }
}

function mapStateToProps(state) {
    return {
        buckets: state.bucketReducer.buckets,
        selectedItemId: state.mainReducer.selectedItemId,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,
        sortingMode: state.mainReducer.sortingMode,
        searchSubSequence: state.mainReducer.starredSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  
        ...bucketsListContainerBucketActions, 
        ...bucketsListContainerActions,
        ...dashboardContainerActions, 
        dashboardNavigateBack,
        navigateBack
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteBucketsContainer);