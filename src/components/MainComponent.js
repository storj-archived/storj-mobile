import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainNavigationContainer from '../containers/MainNavigationContainer';
import ActionBarComponent from '../components/ActionBarComponent';

export default class MainComponent extends Component {
    constructor(props) {
        super(props);
    };
    
    render() {
        return(
            <View style={ styles.mainContainer }>
                <View style = { styles.navigationContainer }>
                    <MainNavigationContainer
                        isSingleItemSelected = { this.props.isSingleItemSelected }
                        isActionBarShown = { this.props.isActionBarShown }
                        isSelectionMode = { this.props.isSelectionMode }
                        onActionBarPress = { () => { this.props.onActionBarPress(); } } />
                </View>
                {
                    this.props.isActionBarShown || this.props.isSelectionMode ? 
                        <ActionBarComponent
                            isSingleItemSelected = { this.props.isSingleItemSelected }
                            isSelectionMode = { this.props.isSelectionMode }
                            selectionModeActions = { this.props.selectionModeActions }
                            tapBarActions = { this.props.tapBarActions } /> : null
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

//TODO: Add prop types
/* MainComponent.PropTypes = {

}; */