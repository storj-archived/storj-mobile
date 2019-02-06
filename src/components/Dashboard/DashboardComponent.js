import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardScreenNavigation from '../../containers/Dashboard/DashboardScreenNavContainer';

export default DashboardComponent = (props) => {

    const animatedScrollValue = new Animated.Value(0);

    return(
        <View style={ styles.mainContainer }>
            <DashboardScreenNavigation
                setSelectionId = { props.setSelectionId }
                defaultRoute = { props.defaultRoute }
                animatedScrollValue = { animatedScrollValue }
                showOptions = { props.showOptions }
                selectAll = { props.selectAll }
                deselectAll = { props.deselectAll } />
        </View>
    )
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