import { View, NavigationActions } from 'react-navigation';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { mainNavContainerActions, mainContainerActions } from '../reducers/mainContainer/mainReducerActions';
import MainScreenTabNav from '../navigators/MainScreenNavigator';

/**
* Container for main screen navigation
*/
class MainNavigationContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <MainScreenTabNav
                navigation = { addNavigationHelpers({
                    isActionBarShown: this.props.isActionBarShown,
                    isSelectionMode: this.props.isSelectionMode,
                    dispatch: this.props.dispatch,
                    state: this.props.nav,
                    test: this.props.testAction,
                    goToBucketsScreen: this.props.goToBucketsScreen,
                    onActionBarPress: this.props.onActionBarPress
                })} />
        );
    };
}

function mapStateToProps(state) {
    return {
        nav: state.mainScreenNavReducer,
        isSelectionMode: state.mainReducer.isSelectionMode
    };
};

function mapDispatchToProps(dispatch) {
    return {
        testAction: () => { dispatch(NavigationActions.navigate({ routeName: 'TestScreen'})); },
        goToBucketsScreen: () => { dispatch(NavigationActions.navigate({ routeName: 'BucketsScreen'})); },
        dispatch
    };
};

const TabNavigatorWithRedux = connect(mapStateToProps, mapDispatchToProps)(MainNavigationContainer);

export default TabNavigatorWithRedux; 

//TODO: Add prop types