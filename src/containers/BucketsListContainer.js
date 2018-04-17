import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    onSingleItemSelected,
    enableSelectionMode,
    disableSelectionMode,
    openBucket
} from '../reducers/mainContainer/mainReducerActions';
import { 
    selectBucket,
    deselectBucket
} from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { navigateToFilesScreen } from '../reducers/navigation/navigationActions';
import ServiceModule from '../utils/ServiceModule';
import BucketsListComponent from '../components/BucketsListComponent';

class BucketsListContainer extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    };

<<<<<<< 83e2c72160fb8351feab18d263abccf208df6c8d
    onPress(params) {
        this.props.openBucket(params.bucketId);
        this.props.navigateToFilesScreen(params.bucketId);    
    } 
=======
    onPress(item) {
        if(this.props.isSingleItemSelected) {
            this.disableSelectionMode();
            return;
        }

        if(this.props.isSelectionMode) {                                             
            this._onSelectionPress(item);
            return;
        }
        
        this._onPress(item);
    }
    onLongPress(item) {
        if(!this.props.isSelectionMode) {
            this.props.enableSelectionMode();
            this._onSelectionPress(item);
        }
    }
    onDotsPress(item) {
        if(this.props.isSingleItemSelected) {
            this.disableSelectionMode();
        } else {
            this.props.onSingleItemSelected();
            this._onSelectionPress(item);
            this.props.screenProps.setSelectionId(item.getId());
        }
    }

    disableSelectionMode() {
        this.props.screenProps.setSelectionId(null);
        this.props.disableSelectionMode();
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
>>>>>>> [REFACTORING] ListComponent, ListItemComponent, GridItemComponent

    render() {
        return(
            <BucketsListComponent
                activeScreen = { this.props.activeScreen }
                setSelectionId = { this.props.screenProps.setSelectionId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (item) => { this.onPress(item); } }
                onLongPress = { (item) => { this.onLongPress(item); } }
                onDotsPress = { (item) => { this.onDotsPress(item); } }
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
                sortingMode = { this.props.sortingMode }
                searchSubSequence = { this.props.searchSubSequence }
                buckets = { this.props.buckets } />
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
            onSingleItemSelected,
            enableSelectionMode,
            disableSelectionMode, 
            selectBucket,
            deselectBucket, 
            openBucket,
            navigateToFilesScreen 
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsListContainer);