import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputComponent from '../components/InputComponent';
import Checkbox from '../components/CheckboxComponent';
import { getWidth, getHeight, getDeviceWidth, getDeviceHeight } from '../utils/adaptive';

/**
 * RegisterScreen component
 */
export default class RegisterComponent extends Component {
	constructor(props) {
        super(props);

        /**
         * prevents calling undefined or null objects
         */
        this.onSubmit = props.onSubmit ? props.onSubmit : () => {};
        this.onChangeEmail = props.onChangeEmail ? props.onChangeEmail : () => {};
        this.onChangePassword = props.onChangePassword ? props.onChangePassword : () => {};
        this.onChangePasswordRepeat = props.onChangePasswordRepeat ? props.onChangePasswordRepeat : () => {};
        this.onChangeTermsAccepted = props.onChangeTermsAcceptence ? props.onChangeTermsAcceptence : () => {};
        this.navigateBack = props.navigateBack ? props.navigateBack : () => {};
        this.redirectToTermsOfUse = props.redirectToTermsOfUse ? props.redirectToTermsOfUse : () => {};
        this.redirectToLoginScreen = props.redirectToLoginScreen ? props.redirectToLoginScreen : () => {};
    };

	render() {
		return(
            <KeyboardAvoidingView style = { styles.mainContainer } keyboardVerticalOffset = { getHeight(30) } resetScrollToCoords = { { x: 0, y: 0 } } scrollEnabled = { true } >
                <View style = { styles.backgoundWrapper }>
                    <Image 
                        style = { styles.backgroundImage } 
                        source = { require('../images/Register/RegisterBackground.png') } />
                    <Image 
                        style = { styles.logo } 
                        source = { require('../images/Icons/LogoBlue.png') } 
                        resizeMode = 'contain'/>
                </View>
                <View style = { styles.contentWrapper }>
                    <Text style = { styles.titleBold }>Welcome</Text>
                    <Text style = { styles.titleLight }>on board</Text>
                    <InputComponent 
                        onChangeText = { this.onChangeEmail }
                         isPassword = { false } 
                         placeholder = {'Email'}
                         isError = { this.props.isEmailError }
                         errorMessage = {'Invalid email'} />
                    <InputComponent 
                        onChangeText = { this.onChangePassword } 
                        isPassword = { true } 
                        placeholder = {'Password'}
                        isError = { this.props.isPasswordError }
                        errorMessage = {'Invalid password'} />
                    <InputComponent 
                        onChangeText = { this.onChangePasswordRepeat } 
                        isPassword = { true } 
                        placeholder = {'Repeat password'}
                        isError = { this.props.isPasswordMatchError }
                        errorMessage = {'Passwords should match'} />
                    <View style = { styles.agreementWrapper }>
                        <Checkbox onPress = { this.onChangeTermsAccepted }/>
                        <Text style = { styles.agreementText }>I agree to the  
                            <Text style = { styles.footerLink } onPress = { this.redirectToTermsOfUse } > Terms of Service</Text> 
                        </Text>
                    </View>
                </View>
                <View style = { styles.footer }>
                    <TouchableOpacity style = { styles.createAccountButton } onPressOut = { this.onSubmit }>
                        <Text style = { styles.createAccountText }>CREATE ACCOUNT</Text>
                    </TouchableOpacity>
                    <Text 
                        style = { styles.footerText }>Already have an account? 
                        <Text 
                            style = { styles.footerLink }
                            onPress = { () => { this.redirectToLoginScreen(); } }> Sign in</Text></Text>
                </View>
                {
                    this.props.isLoading ?
                        <View style={ [ styles.backgoundWrapper ] }>
                            <View style={ [ styles.backgoundWrapper, styles.dimBlack ] } />
                            <View style={ [ styles.backgoundWrapper, styles.setChildCenter ] }>
                                <ActivityIndicator animating={ true } color={ "#2782ff" } size={ "large" }/>
                            </View>
                        </View> : null
                }
            </KeyboardAvoidingView>
		);
	};
}

RegisterComponent.propTypes = {
    onSubmit: PropTypes.func,
    onChangeEmail: PropTypes.func,
    onChangePassword: PropTypes.func,
    onChangePasswordRepeat: PropTypes.func,
    onChangeTermsAcceptence: PropTypes.func,
    navigateBack: PropTypes.func,
    redirectToLoginScreen: PropTypes.func,
    isEmailError: PropTypes.bool,
    isPasswordError: PropTypes.bool,
    isPasswordMatchError: PropTypes.bool,
    isTermsAcceptedError: PropTypes.bool
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    backgroundImage: {
        top: 0,
        right: 0,
        width: getDeviceWidth(),
        height: getDeviceHeight()
    },
    setChildCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    backgoundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.3
    },
    backgoundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute'
    },
    logo: {
        position: 'absolute',
        height: getHeight(58),
        width: getWidth(120),
        top: getHeight(36),
        left: getWidth(16)
    },
    titleBold: {
        fontFamily: 'Montserrat-ExtraBold',
        marginTop: getHeight(23),
        fontSize: getHeight(46),
        color: '#2782ff'
    },
    titleLight: {
        fontFamily: 'Montserrat-ExtraBold',
        lineHeight: getHeight(36),
        fontSize: getHeight(46),
        color: '#2782ff',
        backgroundColor: 'transparent',
        marginBottom: getHeight(13)
    },
    contentWrapper: {
        paddingLeft: getWidth(16),
        paddingRight: getWidth(25),
        marginTop: getHeight(110)
    },
    footer: {
       height: getHeight(113),
       alignItems: 'center'
    },
    createAccountButton: {
       width: getWidth(343),
       height: getHeight(55),
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: '#2782ff',
       borderRadius: getWidth(8)
    },
    createAccountText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: 'white'
    },
    footerText: {
        fontFamily: 'Montserrat',
        lineHeight: getHeight(24),
        fontSize: getHeight(14),
        color: '#4d5664',
        marginTop: getHeight(17)
    },
    footerLink: {
        color: '#2782ff'
    },
    agreementWrapper: {
        flexDirection: 'row',
        marginTop: getHeight(16),
        marginBottom: getHeight(27)
    },
    agreementText: {
        lineHeight: getHeight(24),
        fontSize: getHeight(16),
        color: '#384b65',
        fontFamily: 'Montserrat',
        marginLeft: getWidth(16)
    }
});