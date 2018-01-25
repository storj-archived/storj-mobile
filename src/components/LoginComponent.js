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
                    <InputComponent 
                        onChangeText = { this.onChangeLogin }
                        isPassword = { false } 
                        placeholder = {'Email address'} 
                        value = { this.props.email }
                        isError = { this.props.isEmailError }
                        errorMessage = {'Invalid email'} />
                    <InputComponent 
                        onChangeText = { this.onChangePassword } 
                        isPassword = { true } 
                        placeholder = {'Password'}
                        value = { this.props.password }
                        isError = { this.props.isPasswordError }
                        errorMessage = {'Invalid password'} />
                    <Text style = { styles.mnemonicPlaceholderText }>Mnemonic</Text>
                    <InputComponent 
                        inputStyle = { styles.mnemonicInput }
                        multiline = { true }
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
                        <Text style = { styles.createAccountText }>LOGIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = { styles.loginViaQRButton } onPressOut = { () => {} }> 
                        <Text style = { styles.loginViaQRText }>LOGIN VIA QR</Text>
                    </TouchableOpacity>
                    <Text style = { styles.footerText }>Don't have an account? <Text onPress={ this.props.registerButtonOnPress } style = { styles.footerLink }>Sign Up</Text></Text>              
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
        marginTop: getHeight(95),
        paddingLeft: getWidth(16),
        paddingRight: getWidth(25)
    },
    setChildCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        height: getHeight(58),
        width: getWidth(120),
        top: getHeight(26),
        left: getWidth(16)
    },
    loadingSpinner: {
        height: 150,
        width: 150
    },
    titleBold: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: getHeight(46),
        color: '#2782ff',
        marginBottom: getHeight(5)
    },
    mnemonicInput: {
        height: getHeight(100)
    },
    mnemonicPlaceholderText: {
        fontSize: getHeight(12),
        color: '#8c92ac',
        fontFamily: 'Montserrat'
    },
    mnemonicInfoLinkText: {
        fontSize: getHeight(12),
        color: '#8c92ac',
        alignSelf: 'flex-end',
        fontFamily: 'Montserrat',
        textDecorationLine: 'underline',
        marginBottom: getHeight(24)
    },
    footer: {
        marginTop: getHeight(7),
        height: getHeight(113),
        alignItems: 'center'
     },
    createAccountButton: {
        width: getWidth(343),
        height: getHeight(44),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2782ff',
        borderRadius: getWidth(6)
    },
    loginViaQRButton: {
        marginTop: getHeight(10),
        width: getWidth(343),
        height: getHeight(44),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: getWidth(6),
        borderColor: '#2782ff',
        borderWidth: getWidth(1)
    },
    loginViaQRText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: '#2782ff'
    },
    createAccountText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: 'white'
    },
    footerText: {
        fontFamily: 'Montserrat',
        fontSize: getHeight(14),
        color: '#4d5664',
        marginTop: getHeight(16)
     },
    footerLink: {
         color: '#2782ff'
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
        color: '#384b65',
        fontFamily: 'Montserrat'
    }
});

/**
 * Checking RegisterComponent correct prop types
 */
LoginComponent.propTypes = {
    onSubmit: PropTypes.func,
    onChangeLogin: PropTypes.func,
    onChangePassword: PropTypes.func,
    onChangeMnenonic: PropTypes.func,
    registerButtonOnPress: PropTypes.func,
    email: PropTypes.string,
    password: PropTypes.string,
    mnemonic: PropTypes.string,
    isRedirectedFromRegister: PropTypes.bool
};