import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DashboardScreenNavigation from '../../containers/DashboardScreenNavContainer';

export default class DashboardComponent extends Component {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <DashboardScreenNavigation
                    setSelectionId = { this.props.setSelectionId }
                    defaultRoute = { this.props.defaultRoute }
                    animatedScrollValue = { this.animatedScrollValue }
                    showOptions = { this.props.showOptions }
                    selectAll = { this.props.selectAll }
                    deselectAll = { this.props.deselectAll } />
            </View>
        )
    }
}

DashboardComponent.propTypes = {
    setSelectionId: PropTypes.func,
    showOptions: PropTypes.func,
    defaultRoute: PropTypes.string,
    animatedScrollValue: PropTypes.number,
    defaultRoute: PropTypes.string
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});