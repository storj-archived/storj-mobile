import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationAction, addNavigationHelpers } from 'react-navigation';
import MyAccountScreenNavigator from '../navigators/MyAccountScreenNavigator';

class MyAccountNavContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <MyAccountScreenNavigator
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
        nav: state.myAccountScreenNavReducer
    };
}

function mapDispatchToProps(dispatch) {}

export default connect(mapStateToProps)(MyAccountNavContainer);