import React, { Component } from 'react';
import { Animated } from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dashboardContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { bucketsListContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { bucketsListContainerActions, setSearch, clearSearch } from '../reducers/mainContainer/mainReducerActions';
import { dashboardNavigateBack, navigateBack } from '../reducers/navigation/navigationActions';
import { getShortBucketName } from "../utils/fileUtils";
import filesActions from '../reducers/mainContainer/Files/filesReducerActions';
import BaseListContainer from "../containers/BaseListContainer";
import HeaderBucketsListComponent from "../components/HeaderBucketsListComponent";
import PropTypes from 'prop-types';
import BucketModel from '../models/BucketModel';

/**
 * Container for favorite buckets screen on dashboard
 */
class FavoriteBucketsContainer extends BaseListContainer {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    /**
     * Get all starred buckets
     * @returns {ListItemModel<BucketModel>[]} ListItemModels initialized with BucketModel
     */
    getData() { 
        return this.props.buckets.filter(file => file.getStarred() === true);
    }

    /**
     * Implementation of virtual method from base list container
     * that changes of bucket's selection status 
     * @param {ListItemModel<BucketModel>} bucket ListItemModel initialized with BucketModel
     */
    _onSelectionPress(bucket) {
        if(bucket.isSelected)
            this.props.deselectBucket(bucket);
        else
            this.props.selectBucket(bucket);
    }

    /**
     * Implementation of virtual method from base list container
     * that handles bucket on onPress
     * @param {ListItemModel<BucketModel>} bucket ListItemModel initialized with BucketModel
     */
    _onPress(bucket) {
        /* this.props.openBucket(item.getId());
        this.props.navigateToFilesScreen(item.getId()); */  
    }

    /**      
     * Navigate Back callback. Cleaning search state in header, 
     * disables selecion mode and closes opened in dashboard screen bucket.
    */
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
                lastSync = { this.props.lastSync }
                isLoading = { this.props.isLoading }
                data = { data }
                animatedScrollValue = { this.animatedScrollValue }
                getItemSize = { () => {} }
                getBucketName = { getShortBucketName }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (bucket) => { this.onPress(bucket); } }
                onLongPress = { (bucket) => { this.onLongPress(bucket); } }
                onDotsPress = { (bucket) => { this.onDotsPress(bucket); } }
                onCancelPress = { (bucket) => { this.onCancelPress(bucket); } }                             
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
                getSelectedFilesCount = { this.getSelectedItemsCount(data) }
                selectAll = { this.props.screenProps.selectAll }
                deselectAll = { this.props.screenProps.deselectAll } />
        );
    }
}

function mapStateToProps(state) {
    return {
        lastSync: state.settingsReducer.lastSync,
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
        navigateBack,
        setSearch,
        clearSearch
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteBucketsContainer);