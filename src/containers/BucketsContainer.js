import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketsContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { bucketsContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import BucketsComponent from '../components/BucketsComponent';
import FirstSignInComponent from '../components/FirstSignInComponent';
import StorjLib from '../utils/StorjModule';
import ServiceModule from '../utils/ServiceModule';
import ListItemModel from '../models/ListItemModel';
import { bucketNavigateBack } from '../reducers/navigation/navigationActions';
import { changeSyncStatusAsync, setFirstSignInAsync, SYNC_ENUM } from "../reducers/mainContainer/MyAccount/Settings/SettingsActionsAsync";
import PropTypes from 'prop-types';

class BucketsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        }

        this.email = props.email;
        this.setFirstSignIn = this.setFirstSignIn.bind(this);
        this.changeSyncStatus = this.changeSyncStatus.bind(this);
        this.navigateBack = this.navigateBack.bind(this);
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

    setFirstSignIn(value, callback) {
        this.props.setFirstSignIn(this.email, value, callback);
    }
    changeSyncStatus(value) {
        this.props.changeSyncStatus(this.email, value);
    }
    
    navigateBack() {
        this.props.bucketNavigateBack();
        this.props.disableSelectionMode();
        this.props.closeBucket();
    }

    render() {
        if(this.props.isFirstSignIn) {
            return(
                <FirstSignInComponent
                    removeFirstSignIn = { this.props.removeFirstSignIn }
                    setFirstSignIn = { this.setFirstSignIn }
                    changeSyncStatus = { this.changeSyncStatus }
                    SYNC_ENUM = { SYNC_ENUM }
                    createBucket = { this.createBucket.bind(this)} />
            );
        } else {
            return(
                <BucketsComponent 
                    setSearch = { this.props.setSearch }
                    clearSearch = { this.props.clearSearch }
                    searchIndex = { this.props.searchIndex }                   
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
}

function mapStateToProps(state) {
    let routes = state.bucketsScreenNavReducer.routes;
    let index = state.bucketsScreenNavReducer.index;
    let currentBucketScreenName = routes[index].routeName;
    
    return {
        isFirstSignIn: state.mainReducer.isFirstSignIn,
        isSelectionMode: state.mainReducer.isSelectionMode,        
        buckets: state.bucketReducer.buckets,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        files: state.filesReducer.fileListModels,
        screenName: currentBucketScreenName,
        isGridViewShown: state.mainReducer.isGridViewShown,
        openedBucketId: state.mainReducer.openedBucketId,
        selectedItemId: state.mainReducer.selectedItemId,
        email: state.mainReducer.email,
        searchIndex: currentBucketScreenName === "BucketsListScreen" ? 1 : 2
    };
}
    
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators( { ...bucketsContainerActions, ...bucketsContainerBucketActions, bucketNavigateBack }, dispatch),
        setFirstSignIn: (settingsId, value, callback) => { dispatch(setFirstSignInAsync(settingsId, value, callback)); },
        changeSyncStatus: (settingsId, value) => { dispatch(changeSyncStatusAsync(settingsId, value));}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsContainer);

BucketsContainer.propTypes = {
    bucketNavigateBack: PropTypes.func,
    buckets: PropTypes.array,
    changeSyncStatus: PropTypes.func,
    closeBucket: PropTypes.func,
    createBucket: PropTypes.func,
    deselectBucket: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    email: PropTypes.string,
    enableSelectionMode: PropTypes.func,
    files: PropTypes.array,
    isFirstSignIn: PropTypes.bool,
    isGridViewShown: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    navigation: PropTypes.object,
    onSingleItemSelected: PropTypes.func,
    openedBucketId: PropTypes.string,
    screenName: PropTypes.string,
    screenProps: PropTypes.object,
    selectBucket: PropTypes.func,
    selectedItemId: PropTypes.string,
    setFirstSignIn: PropTypes.func,
    setLoading: PropTypes.func,
    setSelectionId: PropTypes.func,
    unsetLoading: PropTypes.func
}; 