import {
    View,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputComponent from '../components/InputComponent';
import { getWidth, getHeight, getDeviceWidth, getDeviceHeight } from '../utils/adaptive';

/**
 * LoginScreen component
 */
export default class LoginComponent extends Component {
	constructor(props) {
        super(props);

        this.onSubmit = props.onSubmit ? props.onSubmit : () => {};
        this.onChangeLogin = props.onChangeLogin ? props.onChangeLogin : () => {};
        this.onChangePassword = props.onChangePassword ? props.onChangePassword : () => {};
        this.onChangeMnemonic = props.onChangeMnemonic ? props.onChangeMnemonic : () => {};
        this.registerButtonOnPress = props.registerButtonOnPress ? props.registerButtonOnPress : () => {};
	};

	render() {
		return(
			<View style={ styles.mainContainer }>
                <View style={ styles.backgoundWrapper }>
                    <Image 
                        style = { styles.logo } 
                        source = { require('../images/Icons/LogoBlue.png') } 
                        resizeMode = 'contain'/>
                </View>
                <View style={ styles.contentWrapper }>
                    <Text style = { styles.titleBold }>Login</Text>
                    <Text style = { styles.placeholderText } >Email</Text>
                    <InputComponent 
                        style = { styles.inputHeight }
                        onChangeText = { this.onChangeLogin }
                        isPassword = { false } 
                        placeholder = {'your_email@mail.com'} 
                        value = { this.props.email }
                        isError = { this.props.isEmailError }
                        errorMessage = {'Invalid email'} />
                    <Text style = { styles.placeholderText } >Password</Text>
                    <InputComponent 
                        style = { styles.inputHeight }
                        onChangeText = { this.onChangePassword } 
                        isPassword = { true } 
                        placeholder = {'Enter your password'}
                        value = { this.props.password }
                        isError = { this.props.isPasswordError }
                        errorMessage = {'Invalid password'} />
                    <Text style = { styles.mnemonicPlaceholderText }>Mnemonic</Text>
                    <InputComponent 
                        inputStyle = { styles.mnemonicInput }
                        multiline = { true }
                        placeholder = {'Please enter your mnemonic (secret phrase that you generated while registred in Storj befores) or scan your log in credentials via QR code'}
                        onChangeText = { this.onChangeMnemonic } 
                        editable = { !this.props.isRedirectedFromRegister}
                        isPassword = { false }  
                        value = { this.props.mnemonic }
                        isError = { this.props.isMnemonicError } 
                        errorMessage = {'Invalid mnemonic'} />
                    <View style = { styles.agreementWrapper }>
                        <Text style = { styles.agreementText }>Forgot password?</Text>
                        <Text style = { styles.mnemonicInfoLinkText }>What is Mnemonic?</Text>
                    </View>
                </View>
                <View style = { styles.footer }>
                    <TouchableOpacity style = { styles.createAccountButton } onPressOut = { this.onSubmit }>
                        <Text style = { styles.createAccountText }>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = { styles.loginViaQRButton } onPressOut = { () => {} }> 
                        <Text style = { styles.loginViaQRText }>Login via QR</Text>
                    </TouchableOpacity>
                    <Text style = { styles.footerText }>Don't have an account? <Text onPress = { this.props.registerButtonOnPress } style = { styles.footerLink }>Sign Up</Text></Text>              
                </View>
                {
                    this.props.isLoading ?
                        <View style = { [ styles.backgoundWrapper ] }>
                            <View style = { [ styles.backgoundWrapper, styles.dimBlack ] } />
                            <View style = { [ styles.backgoundWrapper, styles.setChildCenter ] }>
                                <ActivityIndicator animating = { true } color = { "#2782ff" } size = { "large" }/>
                            </View>
                        </View> : null
                }
			</View>
		);
	};
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
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
    contentWrapper: {
        marginTop: getHeight(86),
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20)
    },
    setChildCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        height: getHeight(56),
        width: getWidth(120),
        top: getHeight(20),
        left: getWidth(20)
    },
    titleBold: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: getHeight(30),
        color: '#384B65',
        marginBottom: getHeight(5)
    },
    mnemonicInput: {
        height: getHeight(90)
    },
    placeholderText: {
        fontSize: getHeight(12),
        marginTop: getHeight(15),
        color: '#4b657d',
        opacity: 0.4,
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        height: getHeight(15), 
        marginTop: getHeight(29)
    },
    inputHeight: {
        height: getHeight(30)
    },
    mnemonicPlaceholderText: {
        fontSize: getHeight(12),
        marginTop: getHeight(21),
        color: '#4b657d',
        opacity: 0.4,
        fontFamily: 'Montserrat',
        fontWeight: 'bold'
    },
    mnemonicInfoLinkText: {
        fontSize: getHeight(13),
        color: '#2794FF',
        alignSelf: 'flex-end',
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        marginBottom: getHeight(24)
    },
    footer: {
        marginTop: getHeight(10),
        height: getHeight(113),
        alignItems: 'center'
     },
    createAccountButton: {
        width: getWidth(343),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2794FF',
        borderRadius: getWidth(6)
    },
    loginViaQRButton: {
        marginTop: getHeight(10),
        width: getWidth(343),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: getWidth(6),
        borderColor: '#2794FF',
        borderWidth: getWidth(1)
    },
    loginViaQRText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(16),
        color: '#2794FF'
    },
    createAccountText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(16),
        color: 'white'
    },
    footerText: {
        fontFamily: 'Montserrat',
        fontSize: getHeight(16),
        color: '#384B65',
        marginTop: getHeight(10)
     },
    footerLink: {
        fontFamily: 'Montserrat-Bold',
        color: '#2794FF'
    },
    agreementWrapper: {
        flexDirection: 'row',
        marginTop: getHeight(45),
        justifyContent: 'space-between'
    },
    agreementText: {
        marginTop: getHeight(20),
        lineHeight: getHeight(24),
        fontSize: getHeight(16),
        color: '#2794FF',
        fontFamily: 'Montserrat-Bold'
    }
});

/**
 * Checking RegisterComponent correct prop types
 */
LoginComponent.propTypes = {
    onSubmit: PropTypes.func,
    onChangeLogin: PropTypes.func,
    onChangePassword: PropTypes.func,
    registerButtonOnPress: PropTypes.func,
    email: PropTypes.string,
    password: PropTypes.string,
    mnemonic: PropTypes.string,
    isEmailError: PropTypes.bool,
    isRedirectedFromRegister: PropTypes.bool
};
