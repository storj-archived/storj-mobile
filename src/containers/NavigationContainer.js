import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import StackNavigator from '../navigators/StackNavigator';
import { NavigationActions } from 'react-navigation';

/**
 * Component that contains main navigator
 */
class Apps extends Component {

	constructor(props) {
        super(props);

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
		if (this.props.nav.index === 0) {
			return false;
		}

		this.props.dispatch(NavigationActions.back());
		return true;
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
 
/**
 * Creating navigator container
 */
export const AppWithNavigationState = connect(mapStateToProps)(Apps);
