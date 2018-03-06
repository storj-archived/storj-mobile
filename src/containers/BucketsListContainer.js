import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketsListContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { navigateToFilesScreen, navigateBack } from '../reducers/navigation/navigationActions';
import ServiceModule from '../utils/ServiceModule';
import BucketsListComponent from '../components/BucketsListComponent';

class BucketsListContainer extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    };

    onPress(params) {
        this.props.openBucket(params.bucketId);
        this.props.navigateToFilesScreen(params.bucketId);    
    }

    render() {
        return(
            <BucketsListComponent
                setSelectionId = { this.props.screenProps.setSelectionId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (params) => { this.onPress(params); } }
                selectedBucketId = { this.props.screenProps.selectedBucketId }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                onSingleItemSelected = { this.props.onSingleItemSelected }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                deselectBucket = { this.props.deselectBucket }
                selectBucket = { this.props.selectBucket }
                refresh = { () => ServiceModule.getBuckets() }
                buckets = { this.props.buckets } />
        );
    }
}

function mapStateToProps(state) {
    return {
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        buckets: state.mainReducer.buckets,
        isGridViewShown: state.mainReducer.isGridViewShown
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...bucketsListContainerActions, navigateToFilesScreen }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsListContainer);