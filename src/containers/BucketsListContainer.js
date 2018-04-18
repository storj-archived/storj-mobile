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

class BucketsListContainer extends BaseListContainer {
    constructor(props) {
        super(props);
    }

    _onSelectionPress(item) {
        if(item.isSelected)
            this.props.deselectBucket(item);
        else
            this.props.selectBucket(item);
    }

    _onPress(item) {
        this.props.openBucket(item.getId());
        this.props.navigateToFilesScreen(item.getId());    
    }

    render() {
        return(
            <BucketsListComponent
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (item) => { this.onPress(item); } }
                onLongPress = { (item) => { this.onLongPress(item); } }
                onDotsPress = { (item) => { this.onDotsPress(item); } }
                onCancelPress = { () => {} }
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