import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainNavigationContainer from '../containers/MainNavigationContainer';
import MainScreenHeaderComponent from '../components/MainScreenHeaderComponent';
import ActionBarComponent from '../components/ActionBarComponent';

export default class MainComponent extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return(
            <View style={ styles.mainContainer }>
                <MainScreenHeaderComponent
                    isSelectionMode = { this.props.isSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    buckets = { this.props.buckets }
                    currentRoute = { this.props.currentRoute } />
                <View style = { styles.navigationContainer }>
                    <MainNavigationContainer
                        onActionBarPress = { () => { this.props.onActionBarPress(); } } />
                </View>
                {
                    this.props.isActionBarShown ? 
                        <ActionBarComponent
                            createBucket = { this.props.createBucket }
                            isSelectionMode = { this.props.isSelectionMode } /> : null
                }
            </View>
        );
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    navigationContainer: {
        flex: 1
    }
});

/* MainComponent.PropTypes = {

}; */