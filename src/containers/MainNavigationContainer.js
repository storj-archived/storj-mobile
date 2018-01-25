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
    };

    render() {
        return(
            <MainScreenTabNav
                screenProps = {{ 
                    selectedBuckets: this.props.selectedBuckets,
                    buckets: this.props.buckets,
                    selectBucket: this.props.selectBucket,
                    deselectBucket: this.props.deselectBucket,
                    enableSelectionMode: this.props.enableSelectionMode,
                    isSelectionMode: this.props.isSelectionMode
                }}
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
        buckets: state.mainReducer.buckets,
        selectedBuckets: state.mainReducer.selectedBuckets,
        isSelectionMode: state.mainReducer.isSelectionMode
    };
};

function mapDispatchToProps(dispatch) {
    return {
        testAction: () => { dispatch(NavigationActions.navigate({ routeName: 'TestScreen'})); },
        goToBucketsScreen: () => { dispatch(NavigationActions.navigate({ routeName: 'BucketsScreen'})); },
        selectBucket: (bucket)  => { dispatch(mainNavContainerActions.selectBucket(bucket)); },
        deselectBucket: (bucket)  => { dispatch(mainNavContainerActions.deselectBucket(bucket)); },
        enableSelectionMode: () => { dispatch(mainNavContainerActions.enableSelectionMode()) },
        dispatch
    };
};

const TabNavigatorWithRedux = connect(mapStateToProps, mapDispatchToProps)(MainNavigationContainer);

export default TabNavigatorWithRedux;