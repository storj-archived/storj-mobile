import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  View,
  DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addNavigationHelpers } from 'react-navigation';
import StackNavigator from '../navigators/StackNavigator';
import { NavigationActions } from 'react-navigation';
import ServiceModule from '../utils/ServiceModule';
import eventNames from '../utils/constants/eventNames';
import { bucketsContainerActions } from '../reducers/mainContainer/mainReducerActions';
import ListItemModel from '../models/ListItemModel'

/**
 * Component that contains main navigator
 */
class Apps extends Component {

	constructor(props) {
        super(props);

		this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
		this.bucketCreatedListener = null;
    }

	async componentWillMount() {
		await ServiceModule.bindService();

		console.log("APP WILL MOUNT");

		this.bucketCreatedListener = DeviceEventEmitter.addListener(eventNames.BUCKET_CREATED, this.onBucketCreated.bind(this));       
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

		console.log("APP WILL UNMOUNT");
		if(this.bucketCreatedListener) this.bucketCreatedListener.remove();
	}

	onHardwareBackPress() {
		if (this.props.nav.index === 0) {
			return true;
		}

		//this.props.dispatch(NavigationActions.back());
		return true;
	}

	onBucketCreated(response) {
		console.log("BUCKET CREATED RESPONSE");
		console.log(response);
		this.props.createBucket(new ListItemModel(createBucketResult.result));
	}

	render() {
		return (
			<StackNavigator navigation = { 
				addNavigationHelpers({
					dispatch: this.props.dispatch,
					state: this.props.nav
				})
			} />
		);
	};
}

/**
 * connecting navigation reducer to component props
 */
const mapStateToProps = (state) => ({
	nav: state.navReducer
});
 
function mapDispatchToProps(dispatch) {
    return bindActionCreators( { ...bucketsContainerActions }, dispatch);
}

/**
 * Creating navigator container
 */
export const AppWithNavigationState = connect(mapStateToProps, mapDispatchToProps)(Apps);
