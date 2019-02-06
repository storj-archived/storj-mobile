import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight } from '../../utils/adaptive';
import PropTypes from 'prop-types';

export default class CreateBucketPopUpComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bucketName: ''
        };

        this.onApply = this.onApply.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    };

    onChangeText(text) {
        this.setState({ bucketName: text });
    }

    onApply() {
        if(!this.state.bucketName)
            return;

        this.props.onApply(this.state.bucketName);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.inputContainer }>
                    <View style = { styles.backgroundWrapper } />
                    <Image style = { styles.image } source = { require('../../images/Icons/BucketListItemIcon.png') } />
                    <TextInput
                        autoFocus
                        value = { this.state.bucketName }
                        onChangeText = { this.onChangeText }
                        placeholder = { 'Folder title' } 
                        placeholderTextColor = { 'rgba(56, 75, 101, 0.4)' }
                        style = { styles.textInput } 
                        underlineColorAndroid = { 'transparent' } />
                </View>
                <View style = { styles.buttonContainer }>
                    <ButtonComponent
                        onPress = { this.props.onCancel }
                        textStyle = { [ styles.buttonText, styles.cancelText ] }
                        style = { styles.cancelButton } 
                        text='Cancel' />
                    <ButtonComponent 
                        onPress = { this.onApply }
                        style = { styles.applyButton } 
                        textStyle = { [ styles.buttonText, styles.applyText ] }
                        text='OK' />
                </View>
            </View>
        );
    };
}

CreateBucketPopUpComponent.propTypes = {
    onApply: PropTypes.func,
    onCancel: PropTypes.func
}

const ButtonComponent = (props) => (
    <TouchableOpacity style = { [styles.button, props.style] } onPress = { props.onPress }>
        <Text style = { [ styles.buttonText, props.textStyle ] }>{ props.text }</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    mainContainer: {
        width: getWidth(355),
        height: getHeight(165),
        borderRadius: getHeight(10),
        alignItems: 'stretch',
        justifyContent: 'space-around',
        paddingVertical: getHeight(10),
        paddingHorizontal: getWidth(20),
        backgroundColor: 'white'
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: getHeight(5),
        paddingHorizontal: getWidth(15)
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: getWidth(152),
        height: getHeight(50),
        borderRadius: getHeight(10)
    },
    cancelButton: {
        backgroundColor: 'white',
        borderColor: '#2794ff',
        borderWidth: getHeight(1.5)
    },
    applyButton: {
        backgroundColor: '#2794ff'
    },
    cancelText: {
        color: '#2794ff'
    },
    applyText: {
        color: 'white'
    },
    buttonText: {
        fontFamily: 'montserrat_semibold',
        fontSize: getHeight(16)
    },
    image: {
        width: getWidth(25),
        height: getHeight(22)
    },
    textInput: {
        flex: 1,
        paddingHorizontal: getWidth(10),
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        color: '#384B65'
    },
    backgroundWrapper: {
        backgroundColor: 'black',
        opacity: 0.08,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: getHeight(10)
    }
});