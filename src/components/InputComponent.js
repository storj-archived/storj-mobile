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
        let placeholderStyle, message, underlineStyle;

        if(this.props.isError) {
            placeholderStyle = styles.placeholderOnErrorText;
            message = this.props.errorMessage;
            underlineStyle = styles.errorUnderline;
        } else {
            placeholderStyle = styles.placeholderText;
            message = this.props.regularMessage;
            underlineStyle = styles.underline;
        }

        return (
            <View style = { [ styles.inputWrapper, this.props.style ] }>
                <Text style = { placeholderStyle }> { message } </Text>
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
                                                style = { styles.eye } 
                                                source = {
                                                    this.state.isTextShown ? 
                                                    require('../images/Icons/Eye.png') : 
                                                    require('../images/Icons/EyeClosed.png') 
                                                } 
                                                resizeMode = 'contain'/>
                                        </TouchableOpacity>
                                    );
                                }
                            })()
                        }
                </View>
                <View style = { underlineStyle }/>
            </View>
        );
    };
}

InputComponent.propTypes = {
    onChangeText: PropTypes.func,
    isPassword: PropTypes.bool,
    editable: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.number,
    multiline: PropTypes.bool,
    errorMessage: PropTypes.string,
    inputStyle: PropTypes.number,
    isError: PropTypes.bool
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
        height: getHeight(0.5),
        backgroundColor: '#a6b5ca',
        opacity: 0.2
    },
    errorUnderline: {
        height: getHeight(0.5),
        backgroundColor: '#EB5757'
    },
    eye: {
        width: getHeight(24),
        height: getHeight(24)
    },
    placeholderText: {
        fontSize: getHeight(12),
        color: '#4b657d',
        opacity: 0.4,
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        height: getHeight(15), 
    },
    placeholderOnErrorText: {
        fontSize: getHeight(12),
        color: '#EB5757',
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
    },
});