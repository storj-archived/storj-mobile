import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';
import InputComponent from '../InputComponent';

export default class SettingsComponent extends Component{
    constructor(props) {
        super(props)

        this.state = {
            email: null
        }
    }

    async sendEmail() {
        let result = await this.props.screenProps.resetPassword(this.state.email);
        
        if(result) {
            this.props.screenProps.showPopUp();
        }
    }

    render() {
        return(
            <View style = { styles.mainContainer } >
                <View style = { styles.topContainer } >
                    <View style = { styles.topContentContainer } >
                        <View style = { styles.flexRow }>
                            <TouchableOpacity 
                                onPress = { () => { this.props.navigation.goBack(); } }
                                style = { styles.backButtonContainer } >
                                <Image 
                                    source = { require('../../images/MyAccount/BlueBackButton.png') }
                                    style = { styles.icon } />
                            </TouchableOpacity>
                            <View >
                                <Text style = { [styles.titleText, styles.titleMargin] }>Change</Text>
                                <Text style = { [styles.titleText, styles.titleMargin] }>password</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style = { styles.infoText }>We’ll send you a link to change password</Text>
                <InputComponent 
                        style = { styles.emailInput }
                        onChangeText = { (value) => { this.setState({ email: value }) } }  
                        placeholder = {'Enter your email'}
                        isError = { this.props.isPasswordError }
                        regularMessage = { 'Your email' } />
                <TouchableOpacity onPress = { () => { this.sendEmail() } }>
                    <View style = { styles.sendLinkButton } >
                        <Text style = { styles.sendLinkButtonText }>Send me a link</Text>
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
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(30), 
        lineHeight: getHeight(33),
        color: '#384B65' 
    },
    titleMargin: {
        marginLeft: getWidth(20),
    },
    infoText: {
        fontFamily: 'Montserrat-Regular', 
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
        marginTop: getHeight(300),
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
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: 'white'
    }
});