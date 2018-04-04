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

    getSelectedItemsCount() {        

            return this.getArraySelectedCount(this.props.buckets.concat(this.props.files));
    }

    navigateBack() {
        this.props.dashboardNavigateBack();
        this.props.disableSelectionMode();
        this.props.setDashboardBucketId(null);
    }

    render() {
        return(
            <DashboardComponent 
                showOptions = { this.props.screenProps.showOptions }
                setSelectionId = { this.props.setSelectionId }
                files = { this.props.files }
                buckets = { this.props.buckets }
                defaultRoute = { this.props.defaultRoute }
                isFilesScreen = { this.props.screenName !== 'DashboardDefaultScreen' }
                screenName = { this.props.screenName }
                selectItem = { this.props.selectFile }
                navigateBack = { () => { this.navigateBack() } }
                deselectItem = { this.props.deselectFile }      
                isSelectionMode = { this.props.isSelectionMode }
                dashboardBucketId = { this.props.dashboardBucketId }
                selectedBucketId = { this.props.selectedBucketId }
                animatedScrollValue = { this.animatedScrollValue }
                selectedItemsCount = { this.getSelectedItemsCount() }
                disableSelectionMode = { this.props.disableSelectionMode }
                enableSelectionMode = { this.props.enableSelectionMode }
                onSingleItemSelected = { this.props.onSingleItemSelected }  
                isSingleItemSelected = { this.props.isSingleItemSelected } />
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
        dashboardBucketId: state.mainReducer.dashboardBucketId,
        isGridViewShown: state.mainReducer.isGridViewShown,
        defaultRoute: routes[0].routeName,
        screenName: currentScreenName,
        selectedBucketId: state.mainReducer.dashboardBucketId
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