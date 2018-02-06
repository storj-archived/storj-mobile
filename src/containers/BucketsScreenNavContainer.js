import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationAction, addNavigationHelpers } from 'react-navigation';
import BucketsScreenNavigator from '../navigators/BucketsScreenNavigator';

class BucketsScreenNavContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <BucketsScreenNavigator
                screenProps = { { animatedScrollValue: this.props.animatedScrollValue } }
                navigation = { 
                    addNavigationHelpers({
                         dispatch: this.props.dispatch,
                         state: this.props.nav
                    })
                 } />
        );
    }
}

function mapStateToProps(state) {
    return {
        nav: state.bucketsScreenNavReducer
    };
}

function mapDispatchToProps(dispatch) {}

export default connect(mapStateToProps)(BucketsScreenNavContainer);