import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput
} from 'react-native';
import React, { Component } from 'react';

export default class InputPopUpComponent extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.inputContainer }>
                    <Image source = { require("../images/Icons/BucketItemFolder.png") } />
                    <TextInput />
                </View>
                <View style = { styles.buttonContainer }>
                    <ButtonComponent text='test' />
                    <ButtonComponent text='test2' />
                </View>
            </View>
        );
    };
}

const ButtonComponent = (props) => (
    <TouchableOpacity style = { [styles.button, props.style] } onPress = { props.onPress }>
        <Text style = { [ styles.buttonText, props.textStyle ] }>{ props.text }</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white'
    },
    inputContainer: {
        flexDirection: 'row'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {

    }
});