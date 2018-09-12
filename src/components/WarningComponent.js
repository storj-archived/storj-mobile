import {
    View,
    Text,
    StyleSheet,
    StatusBar
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../utils/adaptive';
import PropTypes from 'prop-types';

/**
 * Red warning on top of application with message 
 */
export default class WarningComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { this.props.message ? styles.secretPhraseButton : styles.secretPhraseHide } >
                <StatusBar backgroundColor = { this.props.statusBarColor }/>
                <Text style = { styles.secretPhraseText }>{this.props.message}</Text> 
            </View>
        );
    }
}

WarningComponent.propTypes = {
    message: PropTypes.string,
    statusBarColor: PropTypes.object
};

const styles = StyleSheet.create({
    secretPhraseText: { 
        fontFamily: 'montserrat_medium', 
        fontSize: getHeight(12), 
        color: '#FFFFFF' 
    },
    secretPhraseButton: { 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: getHeight(20), 
        backgroundColor: '#EB5757', 
        justifyContent: 'space-between',
        paddingHorizontal: getWidth(20),
        alignItems: 'center', 
        flexDirection: 'row' 
    },
    secretPhraseHide: { 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: getHeight(0), 
        backgroundColor: '#EB5757', 
        justifyContent: 'space-between',
        paddingHorizontal: getWidth(20),
        alignItems: 'center', 
        flexDirection: 'row' 
    },
    expandImage: { 
        height: getHeight(24), 
        width: getWidth(24)
    },
});
