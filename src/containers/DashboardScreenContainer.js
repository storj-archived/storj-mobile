import React, { Component } from 'react';
import {
    BackHandler,
    Platform
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
        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
    }

    componentDidMount() {
		if(Platform.OS === 'android') {
			BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
    }
    
    componentWillUnmount() {
		if(Platform.OS === 'android') {
			BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
	}

    onHardwareBackPress() {
		this.navigateBack();
	}

    navigateBack() {
        this.props.clearSearch(3);
        this.props.clearSearch(4);
        this.props.dashboardNavigateBack();
        this.props.disableSelectionMode();
        this.props.setDashboardBucketId(null);
    }

    render() {
        return(
            <DashboardComponent 
                showOptions = { this.props.screenProps.showOptions }
                setSelectionId = { this.props.setSelectionId }
                defaultRoute = { this.props.defaultRoute }    
                animatedScrollValue = { this.animatedScrollValue }
                selectAll = { this.props.screenProps.selectAll }
                deselectAll = { this.props.screenProps.deselectAll } />
        ) 
    }
}

function mapStateToProps(state) {
    let routes = state.dashboardScreenNavReducer.routes;

    return {      
        buckets: state.bucketReducer.buckets,
        defaultRoute: routes[0].routeName
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