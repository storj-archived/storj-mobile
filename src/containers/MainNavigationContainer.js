import React, { Component } from 'react';
import { NavigationActions, addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';
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
                screenProps = {{ 
                    showOptions: this.props.showOptions, 
                    showQR: this.props.showQR,
                    showStorageInfo: this.props.showStorageInfo,
                    showCredits: this.props.showCredits,
                    showPopUp: this.props.showPopUp,
                    redirectToInitializationScreen: this.props.redirectToInitializationScreen
                }}
                navigation = { addNavigationHelpers({
                    isActionBarShown: this.props.isActionBarShown,
                    isSelectionMode: this.props.isSelectionMode,
                    isSingleItemSelected: this.props.isSingleItemSelected,
                    dispatch: this.props.dispatch,
                    state: this.props.nav,
                    test: this.props.testAction,
                    goToBucketsScreen: this.props.goToBucketsScreen,
                    onActionBarPress: this.props.onActionBarPress,
                    currentRouteIndex: this.props.nav.index,
                    buckets: this.props.buckets,
                    openBucket: this.props.openBucket, 
                    bucketNavigateBack: this.props.bucketNavigateBack,
                    dashboardNavigateBack: this.props.dashboardNavigateBack
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