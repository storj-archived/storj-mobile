import {
    View,
    TextInput,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getWidth, getHeight } from '../utils/adaptive';

/**
* Styled input component
*/
export default class InputComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTextShown: this.props.isPassword
        };
    };

    onPress() {
        this.setState({isTextShown: !this.state.isTextShown})
    }

    render() {
        const style = typeof(this.props.style) === "object" ? this.props.style : null; 
        const errorMessage = this.props.errorMessage ? this.props.errorMessage : null; 

        return (
            <View style = { [ styles.inputWrapper, style ] }>
                <View style = { styles.textInputWrapper }>
                    <TextInput 
                        placeholderTextColor = 'grey'
                        placeholder = { this.props.placeholder }
                        editable = { this.props.editable}
                        secureTextEntry = { this.state.isTextShown }
                        style = { [styles.textInput, this.props.inputStyle] } 
                        multiline = { this.props.multiline }
                        underlineColorAndroid = 'transparent'
                        autoCorrect={ false }
                        onChangeText={ this.props.onChangeText }
                        value={ this.props.value } />
                        {
                            (() => {
                                if(this.props.isPassword) {
                                    return (
                                         <TouchableOpacity onPress = { () => { this.onPress() } }>
                                            <Image                     
                                                style = { styles.eye  } 
                                                source = { require('../images/Icons/Eye.png') } 
                                                resizeMode = 'contain'/>
                                        </TouchableOpacity>
                                    );
                                }
                            })()
                        }
                </View>
                <View style = { styles.underline }/>
                <Text>{ this.props.isError ? errorMessage : null }</Text>
            </View>
        );
    };
}

InputComponent.propTypes = {
    onChangeText: PropTypes.func,
    isPassword: PropTypes.bool,
    editable: PropTypes.bool,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string
};

const styles = StyleSheet.create({
    inputWrapper: {
        paddingTop: getHeight(12),
        height: getHeight(74)
    },
    textInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textInput: {
        height: getHeight(24),
        width: getWidth(281),
        lineHeight: getHeight(24),
        fontSize: getHeight(16),
        color: '#1c1b1b',
        fontFamily: 'Montserrat',
        padding: 0,
        marginBottom: getHeight(8)
    },
    underline: {
        height: getHeight(1),
        backgroundColor: '#a6b5ca'
    },
    eye: {
        width: getHeight(24),
        height: getHeight(24)
    }
});