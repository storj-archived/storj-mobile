import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';

export default class OptionsComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <TouchableOpacity>
                <View  style = { styles.secretPhraseButton }>
                    <Text style = { styles.secretPhraseText }>Back up your Secret Phrase</Text> 
                        <Image 
                            style = { styles.expandImage }
                            source = { require('../../images/MyAccount/Expand.png') }
                            resizeMode = 'contain' />
                </View>
            </TouchableOpacity>
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
        height: getHeight(30), 
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
