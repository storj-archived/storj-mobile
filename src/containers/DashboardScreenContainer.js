import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dashboardContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { dashboardNavigateBack, navigateToFilesScreen } from '../reducers/navigation/navigationActions';
import DashboardComponent from '../components/DashboardComponent';
import FirstSignInComponent from '../components/FirstSignInComponent';

class DashboardScreenContainer extends Component {
    constructor(props) {
        super(props);
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

        let openedBucket = this.props.files.find(item => {
            return item.bucketId === this.props.selectedBucketId;
        });

        if(openedBucket) {
            return this.getArraySelectedCount(openedBucket.files);
        }
    }

    async createBucket(name) {
        this.props.setLoading();

        try {
            let createBucketResult = await StorjLib.createBucket(name);

            if(createBucketResult.isSuccess) {
                this.props.createBucket(new ListItemModel(createBucketResult.result));
                this.props.removeFirstSignIn();
            } 
        } catch (e) {
            console.log(e);
        }

        this.props.unsetLoading();
    }

    render() {
        if(this.props.isFirstSignIn) {
            return(
                <FirstSignInComponent
                    removeFirstSignIn = { this.props.removeFirstSignIn }
                    createBucket = { this.createBucket.bind(this)} />
            );
        } else {
            return(
                <DashboardComponent
                    showOptions = { this.props.screenProps.showOptions }
                    files = { this.props.files }
                    buckets = { this.props.buckets }
                    openBucket = { this.props.openBucket}
                    defaultRoute = { this.props.defaultRoute }
                    screenName = { this.props.screenName }
                    selectItem = { this.props.selectBucket }
                    navigateBack = { this.props.dashboardNavigateBack }
                    deselectItem = { this.props.deselectBucket }      
                    isSelectionMode = { this.props.isSelectionMode }
                    selectedBucketId = { this.props.selectedBucketId }
                    animatedScrollValue = { this.animatedScrollValue }
                    selectedFilesCount = { this.getSelectedFilesCount() }  
                    selectedBucketsCount = { this.getSelectedBucketsCount() }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    onSingleItemSelected = { this.props.onSingleItemSelected }  
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    navigateToFilesScreen = { this.props.navigateToFilesScreen } />
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
        fileListModels: state.filesReducer.fileListModels,
        files: state.filesReducer.fileListModels,
        isGridViewShown: state.mainReducer.isGridViewShown,
        defaultRoute: routes[0].routeName,
        screenName: currentScreenName,
        selectedBucketId: state.mainReducer.openedBucketId
    };
}
    
function mapDispatchToProps(dispatch) {
    return bindActionCreators( { 
        ...dashboardContainerActions, 
        ...filesListContainerMainActions, 
        ...filesListContainerFileActions, 
        dashboardNavigateBack,
        navigateToFilesScreen
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreenContainer);;