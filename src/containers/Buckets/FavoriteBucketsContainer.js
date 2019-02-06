import React from 'react';
import { Animated } from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dashboardContainerActions } from '../../reducers/mainContainer/mainReducerActions';
import { bucketsListContainerBucketActions, selectBuckets, deselectBuckets } from '../../reducers/mainContainer/Buckets/bucketReducerActions';
import { bucketsListContainerActions, setSearch, clearSearch } from '../../reducers/mainContainer/mainReducerActions';
import { dashboardNavigateBack, navigateBack } from '../../reducers/navigation/navigationActions';
import { getShortBucketName } from "../../utils/fileUtils";
import BaseListContainer from "../BaseListContainer";
import HeaderBucketsListComponent from "../../components/Buckets/HeaderBucketsListComponent";
import BucketModel from '../../models/BucketModel';

/**
 * Container for favorite buckets screen on dashboard
 */
class FavoriteBucketsContainer extends BaseListContainer {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);

        this.emptyFunction = () => {};
        this.deselectBuckets = this.deselectBuckets.bind(this);
        this.navigateBack = this.navigateBack.bind(this);
        this.selectAll = this.selectAll.bind(this);
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
     * Action for clearing selection on dashboard favorite buckets screen,
     * also disables selection mode for closing selection header
     */
    deselectBuckets() {
        this.props.deselectBuckets();
        this.props.disableSelectionMode();
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

    getDataForSelection() {
        let data = this.getData().slice();
        
        if(this.props.searchSubSequence) {
            return data.filter(bucket => bucket.entity.name.toLowerCase().includes(this.props.searchSubSequence.toLowerCase()))
        }

        return data;
    }

    selectAll() {
        this.props.selectBuckets(this.getDataForSelection());
    }

    render() {
        let data = this.getData();
        
        return (
            <HeaderBucketsListComponent
                lastSync = { this.props.lastSync }
                isLoading = { this.props.isLoading }
                data = { data }
                animatedScrollValue = { this.animatedScrollValue }
                getItemSize = { this.emptyFunction }
                getBucketName = { getShortBucketName }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { this.onPress }
                onLongPress = { this.onLongPress }
                onDotsPress = { this.onDotsPress }
                onCancelPress = { this.onCancelPress }                             
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                sortingMode = { this.props.sortingMode }
                searchSubSequence = { this.props.searchSubSequence }
                onRefresh = { this.emptyFunction }

                isFilesScreen = { true }
                searchIndex = { 3 }
                navigateBack = { this.navigateBack }
                buckets = { [] }
                setSearch = { this.props.setSearch }
                clearSearch = { this.props.clearSearch }
                disableSelectionMode = { this.props.disableSelectionMode }
                showOptions = { this.props.screenProps.showOptions }
                getSelectedFilesCount = { this.getSelectedItemsCount(data) }
                selectAll = { this.selectAll }
                deselectAll = { this.deselectBuckets } />
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
        clearSearch,
        selectBuckets,
        deselectBuckets
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteBucketsContainer);