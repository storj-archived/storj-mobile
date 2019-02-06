import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../../utils/adaptive';
import InputComponent from '../../Common/InputComponent';
import validator from '../../../utils/validator';
import PropTypes from 'prop-types';

export default class ChangePasswordComponent extends Component{
    constructor(props) {
        super(props)

        this.state = {
            email: null,
            isError: false
        }

        this.sendEmail = this.sendEmail.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.emptyFunction = () => {};
    }

    async sendEmail() {
        if(validator.isEmail(this.state.email)) {
            let result = await this.props.screenProps.resetPassword(this.state.email);
            
            if(result) {
                this.props.screenProps.changePasswordPopupStatus(true);
            } else this.setState({isError: true});
        } else this.setState({isError: true}); 
    }

    onChangeEmail(value) {
        this.setState({ email: value, isError: false });
    }

    render() {
        return(
            <View style = { styles.mainContainer } >
                <View style = { styles.topContainer } >
                    <View style = { styles.topContentContainer } >
                        <View style = { styles.flexRow }>
                            <TouchableOpacity 
                                onPress = { this.props.screenProps.redirectToSettingsScreen }
                                style = { styles.backButtonContainer } >
                                <Image 
                                    source = { require('../../../images/MyAccount/BlueBackButton.png') }
                                    style = { styles.icon } />
                            </TouchableOpacity>
                            <View >
                                <Text style = { [styles.titleText, styles.titleMargin] }>Need password </Text>
                                <Text style = { [styles.titleText, styles.titleMargin] }>help?</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style = { styles.infoText }>Enter your email address below and we’ll send you a link to reset your password.</Text>
                <InputComponent 
                        style = { styles.emailInput }
                        onChangeText = { this.onChangeEmail }  
                        placeholder = {'Enter your email'}
                        isError = { this.props.isPasswordError }
                        regularMessage = { 'Your email' }
                        errorMessage = { 'There is no such email in our system' }
                        isError = { this.state.isError } />
                <TouchableOpacity onPress = { this.state.email ? this.sendEmail : this.emptyFunction }>
                    <View style = { this.state.email ? styles.sendLinkButton : [ styles.sendLinkButton, styles.blurredButton ] } >
                        <Text style = { styles.sendLinkButtonText }>Reset password</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor: '#FFFFFF',
        paddingHorizontal: getWidth(20)
    },
    topContainer: {
        height: getHeight(115)
    },
    topContentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: getHeight(15)
    },
    backButtonContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: getHeight(6),
        height: getHeight(100)
    },
    flexRow: {
        flexDirection: 'row'
    },
    titleText: { 
        fontFamily: 'montserrat_bold', 
        fontSize: getHeight(30), 
        color: '#384B65' 
    },
    titleMargin: {
        marginLeft: getWidth(20),
    },
    infoText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#384B65' 
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    emailInput: {
        marginTop: getHeight(24),
        height: getHeight(50)
    },
    sendLinkButton: {
        marginTop: getHeight(290),
        alignSelf: 'center',
        width: getWidth(335),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2794FF',
        borderColor: '#2794FF',
        borderRadius: getWidth(6),
        borderWidth: getWidth(1.5)
    },
    sendLinkButtonText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(14),
        color: 'white'
    },
    blurredButton: {
        backgroundColor: 'rgba(38, 132, 255, 0.4)', 
        borderColor: '#FFFFFF'
    }
});

ChangePasswordComponent.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object
}