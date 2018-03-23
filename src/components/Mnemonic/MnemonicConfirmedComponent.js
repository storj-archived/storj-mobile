import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import mnemonicScreenConstants from '../../utils/constants/mnemonicScreenConstants';
import { getWidth, getHeight } from '../../utils/adaptive';

export default class MnemonicConfirmedComponent extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.contentContainer }>
                    <View style = { styles.titleContainer } >
                        <Text style = { styles.titleText } >Secret phrase backup confirmed</Text>
                    </View>
                    <View style = { styles.successImageContainer }>
                        <Image
                            source = { require('../../images/RegisterInfoScreens/SuccessImage.png') }
                            style = { styles.successImage }
                            resizeMode = 'contain' />
                    </View>
                    <TouchableOpacity onPress = { () => { this.props.screenProps.redirectToLoginScreen(); } }>
                        <View style = { styles.loginButton } >
                            <Text style = { styles.loginButtonText }>Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }   
}

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#FFFFFF'
    },
    contentContainer: {
        paddingHorizontal: getWidth(20)
    },
    titleContainer: { 
        marginTop: getHeight(30),
        height: getHeight(70),
        flexDirection: 'row' 
    },
    titleText: { 
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(27), 
        lineHeight: getHeight(33),
        color: '#384B65',
        marginLeft: getWidth(15)
    },
    titleTextContainer: {
        width: getWidth(191)
    },
    successImage: {
        height: getHeight(250),
        width: getWidth(375)
    },
    successImageContainer: {
        height: getHeight(250),
        marginTop: getHeight(75),
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoContainer: {
        marginTop: getHeight(45)
    },
    infoText:{
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(23),
        color: '#384B65'
    },
    loginButton: {
        marginTop: getHeight(130),
        alignSelf: 'center',
        width: getWidth(335),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2782ff',
        borderColor: '#2794FF',
        borderRadius: getWidth(6),
        borderWidth: getWidth(1.5)
    },
    loginButtonText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: 'white'
    },
});