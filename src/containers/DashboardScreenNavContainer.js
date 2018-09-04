import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import DashboardScreenNavigator from '../navigators/DashboardScreenNavigator';

class DashboardScreenNavContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <DashboardScreenNavigator
                screenProps = { { 
                    animatedScrollValue: this.props.animatedScrollValue, 
                    defaultRoute: this.props.defaultRoute,
                    setSelectionId: this.props.setSelectionId,
                    showOptions : this.props.showOptions,
                    selectAll: this.props.selectAll,
                    deselectAll: this.props.deselectAll 
                 } }
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
        nav: state.dashboardScreenNavReducer
    };
}

export default connect(mapStateToProps)(DashboardScreenNavContainer);