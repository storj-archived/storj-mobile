import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import InputComponent from '../components/InputComponent';
import Checkbox from '../components/CheckboxComponent';
import { getWidth, getHeight, getDeviceWidth, getDeviceHeight } from '../utils/adaptive';

/**
 * RegisterScreen component
 */
export default RegisterComponent = (props) => {

    return(
        <ScrollView style={ styles.mainContainer } keyboardDismissMode = { "on-drag" } keyboardShouldPersistTaps = { 'always' } >
            <View style = { styles.contentWrapper }>
                <Text style = { styles.titleBold }>Let’s get started</Text>
                <View style = { styles.firstInputMargin }>
                    <InputComponent 
                        onChangeText = { props.onChangeEmail }
                        isPassword = { false } 
                        placeholder = {'Email'}
                        isError = { props.isEmailError }
                        errorMessage = { 'Invalid Email' } />
                </View>
                <View>
                    <InputComponent 
                        onChangeText = { props.onChangePassword } 
                        isPassword = { true } 
                        placeholder = {'Password'}
                        isError = { props.isPasswordError }
                        errorMessage = { 'Invalid password' } />
                </View>
                <View>
                    <InputComponent 
                        onChangeText = { props.onChangePasswordRepeat } 
                        isPassword = { true } 
                        placeholder = {'Confirm password'}
                        isError = { props.isPasswordMatchError }
                        errorMessage = { 'Password doesn`t match' } />
                </View>
                <View style = { styles.agreementWrapper }>
                    <Checkbox onPress = { props.onChangeTermsAcceptence }/>
                    <Text style = { styles.agreementText }>I agree to the  
                        <Text style = { styles.footerLink } onPress = { props.redirectToTermsOfUse } > Terms of Service</Text> 
                    </Text>
                </View>
            </View>
            <View style = { styles.footer }>
                <TouchableOpacity 
                style = { props.isButtonDisabled ? [styles.createAccountButton, styles.blurredButton] : styles.createAccountButton } 
                onPressOut = { props.isButtonDisabled ? () => {} : props.onSubmit }>
                    <Text style = { styles.createAccountText }>Create account</Text>
                </TouchableOpacity>
                <Text 
                    style = { styles.footerText }>Already have an account? 
                    <Text 
                        style = { styles.footerLink }
                        onPress = { props.redirectToLoginScreen }> Login</Text></Text>
            </View>
            {
                props.isLoading ?
                    <View style={ [ styles.backgroundWrapper, styles.setChildCenter ] }>
                        <ActivityIndicator animating={ true } color={ "#2782ff" } size={ "large" }/>
                    </View>
                    : null
            }
        </ScrollView>
    );
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
    isTermsAcceptedError: PropTypes.bool,
    isButtonDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    redirectToTermsOfUse: PropTypes.func
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
    backgroundWrapper: {
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
    logo: {
        position: 'absolute',
        height: getHeight(56),
        width: getWidth(120),
        top: getHeight(20),
        left: getWidth(20)
    },
    titleBold: {
        fontFamily: 'montserrat_extrabold',
        fontSize: getHeight(30),
        color: '#384B65'
    },
    contentWrapper: {
        paddingLeft: getWidth(21),
        paddingRight: getWidth(25),
        marginTop: getHeight(20)
    },
    firstInputMargin: { 
        marginTop: getHeight(99),
        backgroundColor: 'transparent'
    },
    footer: {
       height: getHeight(113),
       alignItems: 'center',
       marginTop: getHeight(100)
    },
    createAccountButton: {
        width: getWidth(343),
        height: getHeight(55),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2794FF',
        borderRadius: getWidth(8)
    },
    createAccountText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(16),
        color: '#FFFFFF'
    },
    footerText: {
        fontFamily: 'Montserrat',
        lineHeight: getHeight(24),
        fontSize: getHeight(16),
        color: '#384B65',
        marginTop: getHeight(15)
    },
    footerLink: {
        fontFamily: 'montserrat_bold',
        color: '#2794FF'
    },
    agreementWrapper: {
        flexDirection: 'row',
        marginTop: getHeight(20),
    },
    agreementText: {
        lineHeight: getHeight(24),
        fontSize: getHeight(16),
        color: '#384b65',
        fontFamily: 'montserrat_regular',
        marginLeft: getWidth(11)
    },
    blurredButton: {
        backgroundColor: 'rgba(38, 132, 255, 0.4)', 
        borderColor: '#FFFFFF'
    }
});