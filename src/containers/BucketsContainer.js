import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketsContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { bucketsContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import BucketsComponent from '../components/BucketsComponent';
import StorjLib from '../utils/StorjModule';
import ServiceModule from '../utils/ServiceModule';
import ListItemModel from '../models/ListItemModel';
import { bucketNavigateBack } from '../reducers/navigation/navigationActions';

class BucketsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        }
    }

    getArraySelectedCount(array) {
        return array.filter(item => item.isSelected).length;
    }
  
    getSelectedBucketsCount() {
        if(!this.props.buckets) return 0;

        return this.getArraySelectedCount(this.props.buckets);
    }

    getSelectedFilesCount() {        
        if(!this.props.openedBucketId || !this.props.files || this.props.files.length === 0) return 0; 

        let openedBucket = this.props.files.filter(item => item.entity.bucketId === this.props.openedBucketId);

        if(openedBucket) {
            return this.getArraySelectedCount(openedBucket);
        }
    } 

    getSelectedItemsCount() {
        if(this.props.screenName === "FilesScreen") {
            let result = this.getSelectedFilesCount();
            return result;
        } else {
            return this.getSelectedBucketsCount();
        }
    }

    async createBucket(name) {   
        ServiceModule.createBucket(name);        
    }
    
    navigateBack() {
        this.props.bucketNavigateBack();
        this.props.disableSelectionMode();
        this.props.closeBucket();
    }

    render() {
        return(
            <BucketsComponent
                setSelectionId = { this.props.setSelectionId }
                isFilesScreen = { this.props.screenName === "FilesScreen" }
                selectedItemsCount = { this.getSelectedItemsCount() }
                showOptions = { this.props.screenProps.showOptions }
                onSingleItemSelected = { this.props.onSingleItemSelected }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                deselectBucket = { this.props.deselectBucket }
                selectBucket = { this.props.selectBucket }
                buckets = { this.props.buckets }
                openedBucketId = { this.props.openedBucketId }
                selectedItemId = { this.props.selectedItemId }
                files = { this.props.files }
                navigateBack = { () => { this.navigateBack(); } } /> 
        );
    }
}

function mapStateToProps(state) {
    let routes = state.bucketsScreenNavReducer.routes;
    let index = state.bucketsScreenNavReducer.index;
    let currentBucketScreenName = routes[index].routeName;

    return {
        isSelectionMode: state.mainReducer.isSelectionMode,        
        buckets: state.bucketReducer.buckets,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        files: state.filesReducer.fileListModels,
        screenName: currentBucketScreenName,
        isGridViewShown: state.mainReducer.isGridViewShown,
        openedBucketId: state.mainReducer.openedBucketId,
        selectedItemId: state.mainReducer.selectedItemId
    };
}
    
function mapDispatchToProps(dispatch) {
    return bindActionCreators( { ...bucketsContainerActions, ...bucketsContainerBucketActions, bucketNavigateBack }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsContainer);

//TODO: Add prop types