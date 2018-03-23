import React, { Component } from 'react';
import {    
  	View,
} from 'react-native';
import { Provider } from 'react-redux';
import { AppWithNavigationState } from '../containers/NavigationContainer';
import { store } from '../reducers/index';

/* Entry point of application */
export default class App extends Component {
	constructor() {
		super();
				
		global.btoa = require('base-64').encode;
	};

	render() {
		return (
			<Provider store = { store }>
				<AppWithNavigationState />
			</Provider>
		);
  	};
}
