import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../utils/adaptive';

export default class WarningComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { this.props.message ? styles.secretPhraseButton : styles.secretPhraseHide } >
                <StatusBar backgroundColor = { this.props.statusBarColor }/>
                <Text style = { styles.secretPhraseText }>{this.props.message}</Text> 
                    <Image 
                        style = { styles.expandImage }
                        source = { require('../images/MyAccount/Expand.png') }
                        resizeMode = 'contain' />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    secretPhraseText: { 
        fontFamily: 'Montserrat-Medium', 
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
