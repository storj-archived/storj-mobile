import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dashboardContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { dashboardNavigateBack, navigateToDashboardFilesScreen, navigateBack } from '../reducers/navigation/navigationActions';
import { changeSyncStatusAsync, setFirstSignInAsync, SYNC_ENUM } from "../reducers/mainContainer/MyAccount/Settings/SettingsActionsAsync";
import DashboardComponent from '../components/Dashboard/DashboardComponent';
import FirstSignInComponent from '../components/FirstSignInComponent';
import SerivceModule from "../utils/ServiceModule";

class DashboardScreenContainer extends Component {
    constructor(props) {
        super(props);

        this.email = props.email;

        this.setFirstSignIn = this.setFirstSignIn.bind(this);
        this.changeSyncStatus = this.changeSyncStatus.bind(this);
    }

    getArraySelectedCount(array) {
        return array.filter((item) => {
            return item.isSelected;
        }).length;
    }
  
    getSelectedBucketsCount() {
        if(!this.props.buckets) return 0;

        return this.getArraySelectedCount(this.props.buckets);
    }

    getSelectedFilesCount() {
        if(!this.props.selectedBucketId || !this.props.files || this.props.files.length === 0) return 0; 
        
        return this.props.files.filter(fileItem => {
            return fileItem.isSelected;
        }).length;          
    }

    async createBucket(name) {
        SerivceModule.createBucket(name);
    }

    setFirstSignIn(value, callback) {
        this.props.setFirstSignIn(this.email, value, callback);
    }
    changeSyncStatus(value) {
        this.props.changeSyncStatus(this.email, value);
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
                <DashboardComponent
                    showOptions = { this.props.screenProps.showOptions }
                    setSelectionId = { this.props.setSelectionId }
                    files = { this.props.files }
                    buckets = { this.props.buckets }
                    openBucket = { this.props.openBucket}
                    defaultRoute = { this.props.defaultRoute }
                    isFilesScreen = { this.props.screenName === 'DashboardFilesScreen' }
                    screenName = { this.props.screenName }
                    selectItem = { this.props.selectBucket }
                    navigateBack = { this.props.navigateBack }
                    deselectItem = { this.props.deselectBucket }      
                    isSelectionMode = { this.props.isSelectionMode }
                    selectedBucketId = { this.props.selectedBucketId }
                    animatedScrollValue = { this.animatedScrollValue }
                    selectedFilesCount = { this.getSelectedFilesCount() }  
                    selectedBucketsCount = { this.getSelectedBucketsCount() }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    onSingleItemSelected = { this.props.onSingleItemSelected }  
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    navigateToDashboardFilesScreen = { this.props.navigateToDashboardFilesScreen } />
            )
        }
    }
}

function mapStateToProps(state) {
    let routes = state.dashboardScreenNavReducer.routes;
    let index = state.dashboardScreenNavReducer.index;
    let currentScreenName = routes[index].routeName;

    return {
        isSelectionMode: state.mainReducer.isSelectionMode,        
        buckets: state.mainReducer.buckets,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        isFirstSignIn: state.mainReducer.isFirstSignIn,
        files: state.filesReducer.fileListModels,
        isGridViewShown: state.mainReducer.isGridViewShown,
        defaultRoute: routes[0].routeName,
        screenName: currentScreenName,
        selectedBucketId: state.mainReducer.openedBucketId,
        email: state.mainReducer.email
    };
}
    
const settingsId = "elvy.baila@arockee.com";
function mapDispatchToProps(dispatch) {
    return { 
        ...bindActionCreators( { 
            ...dashboardContainerActions, 
            ...filesListContainerMainActions, 
            ...filesListContainerFileActions, 
            dashboardNavigateBack,
            navigateToDashboardFilesScreen,
            navigateBack
        }, dispatch),
        setFirstSignIn: (settingsId, value, callback) => { dispatch(setFirstSignInAsync(settingsId ,value, callback)); },
        changeSyncStatus: (settingsId, value) => { dispatch(changeSyncStatusAsync(settingsId ,value)); },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreenContainer);;