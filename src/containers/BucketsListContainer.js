import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketsListContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { bucketsListContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
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
                activeScreen = { this.props.activeScreen }
                setSelectionId = { this.props.screenProps.setSelectionId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (params) => { this.onPress(params); } }
                selectedItemId = { this.props.screenProps.selectedItemId }
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
        activeScreen: state.mainReducer.activeScreen,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        buckets: state.bucketReducer.buckets,
        isGridViewShown: state.mainReducer.isGridViewShown
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...bucketsListContainerActions, ...bucketsListContainerBucketActions, navigateToFilesScreen }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsListContainer);