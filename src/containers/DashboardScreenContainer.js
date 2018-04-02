import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dashboardContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { dashboardContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { dashboardNavigateBack, navigateToDashboardFilesScreen, navigateBack } from '../reducers/navigation/navigationActions';
import DashboardComponent from '../components/Dashboard/DashboardComponent';


class DashboardScreenContainer extends Component {
    constructor(props) {
        super(props);

        this.navigateBack = this.navigateBack.bind(this);
    }

    getArraySelectedCount(array) {
        return array.filter(item => item.isSelected).length;
    }

    getSelectedFilesCount() {        
        if(!this.props.openedBucketId || !this.props.files || this.props.files.length === 0) return 0; 

        let openedBucket = this.props.files.filter(item => item.entity.bucketId === this.props.openedBucketId);

        if(openedBucket) {
            return this.getArraySelectedCount(openedBucket);
        }
    }

    navigateBack() {
        this.props.disableSelectionMode();
        this.props.navigateBack();
    }

    render() {
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
                navigateBack = { this.navigateBack }
                deselectItem = { this.props.deselectBucket }      
                isSelectionMode = { this.props.isSelectionMode }
                selectedBucketId = { this.props.selectedBucketId }
                animatedScrollValue = { this.animatedScrollValue }
                selectedItemsCount = { this.getSelectedFilesCount() }
                disableSelectionMode = { this.props.disableSelectionMode }
                onSingleItemSelected = { this.props.onSingleItemSelected }  
                isSingleItemSelected = { this.props.isSingleItemSelected }
                navigateToDashboardFilesScreen = { this.props.navigateToDashboardFilesScreen } />
        ) 
    }
}

function mapStateToProps(state) {
    let routes = state.dashboardScreenNavReducer.routes;
    let index = state.dashboardScreenNavReducer.index;
    let currentScreenName = routes[index].routeName;

    return {
        isSelectionMode: state.mainReducer.isSelectionMode,        
        buckets: state.bucketReducer.buckets,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        isFirstSignIn: state.mainReducer.isFirstSignIn,
        files: state.filesReducer.fileListModels,
        isGridViewShown: state.mainReducer.isGridViewShown,
        defaultRoute: routes[0].routeName,
        screenName: currentScreenName,
        selectedBucketId: state.mainReducer.openedBucketId
    };
}
    
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators( { 
            ...dashboardContainerActions, 
            ...dashboardContainerBucketActions,
            ...filesListContainerMainActions, 
            ...filesListContainerFileActions, 
            dashboardNavigateBack,
            navigateToDashboardFilesScreen,
            navigateBack
        }, dispatch)
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreenContainer);;