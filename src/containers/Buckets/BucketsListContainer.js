import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketsListContainerActions } from '../../reducers/mainContainer/mainReducerActions';
import { bucketsListContainerBucketActions } from '../../reducers/mainContainer/Buckets/bucketReducerActions';
import { navigateToFilesScreen } from '../../reducers/navigation/navigationActions';
import { getShortBucketName } from "../../utils/fileUtils";
import ServiceModule from '../../utils/ServiceModule';
import BaseListContainer from "../BaseListContainer";
import BucketsListComponent from '../../components/Buckets/BucketsListComponent';
import ListItemModel from '../../models/ListItemModel';
import BucketModel from '../../models/BucketModel';

/**
 * Buckets list container
 */
class BucketsListContainer extends BaseListContainer {
    constructor(props) {
        super(props);

        this._onSelectionPress = this._onSelectionPress.bind(this);
        this._onPress = this._onPress.bind(this);
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

    shouldComponentUpdate(nextProps) {
        var currenName = nextProps.nav.routes[nextProps.nav.index].routeName;

        if (currenName === "FilesScreen" ) {
            return false;
        } 

        return true;
    }

    render() {        
        return(
            <BucketsListComponent
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { this.onPress }
                onLongPress = { this.onLongPress }
                onDotsPress = { this.onDotsPress }
                onCancelPress = { this.onCancelPress }
                selectedItemId = { this.props.screenProps.selectedItemId }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                isSelectionMode = { this.props.isSelectionMode }
                isLoading = { false }
                onRefresh = { ServiceModule.getBuckets }
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
        nav: state.bucketsScreenNavReducer,
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
    return {
        ...bindActionCreators({
            ...bucketsListContainerActions,
            ...bucketsListContainerBucketActions, 
            navigateToFilesScreen 
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsListContainer);