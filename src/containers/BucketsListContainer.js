import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketsListContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { bucketsListContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { navigateToFilesScreen, navigateBack } from '../reducers/navigation/navigationActions';
import { getShortBucketName } from "../utils/fileUtils";
import ServiceModule from '../utils/ServiceModule';
import BaseListContainer from "../containers/BaseListContainer";
import BucketsListComponent from '../components/BucketsListComponent';
import ListItemModel from '../models/ListItemModel';
import BucketModel from '../models/BucketModel';

/**
 * Buckets list container
 */
class BucketsListContainer extends BaseListContainer {
    constructor(props) {
        super(props);
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
     * Opens new screen that list all files of selected buckets 
     * @param {ListItemModel<BucketModel>} bucket ListItemModel initialized with BucketModel
     */
    _onPress(bucket) {
        this.props.openBucket(bucket.getId());
        this.props.navigateToFilesScreen(bucket.getId());    
    }

    render() {
        return(
            <BucketsListComponent
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (bucket) => { this.onPress(bucket); } }
                onLongPress = { (bucket) => { this.onLongPress(bucket); } }
                onDotsPress = { (bucket) => { this.onDotsPress(bucket); } }
                onCancelPress = { (bucket) => { this.onCancelPress(bucket); } }
                selectedItemId = { this.props.screenProps.selectedItemId }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                isSelectionMode = { this.props.isSelectionMode }
                isLoading = { false }
                onRefresh = { () => ServiceModule.getBuckets() }
                sortingMode = { this.props.sortingMode }
                searchSubSequence = { this.props.searchSubSequence }
                getItemSize = { () => {} }
                getBucketName = { getShortBucketName }
                data = { this.props.buckets } />
        );
    }
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName;
    
    return {
        activeScreen: currentScreenName,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        buckets: state.bucketReducer.buckets,
        isGridViewShown: state.mainReducer.isGridViewShown,
        sortingMode: state.mainReducer.sortingMode,
        searchSubSequence: state.mainReducer.bucketSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators({
            ...bucketsListContainerActions,
            ...bucketsListContainerBucketActions, 
            navigateToFilesScreen 
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsListContainer);