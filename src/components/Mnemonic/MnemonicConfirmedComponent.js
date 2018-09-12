import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React from 'react';
import { getWidth, getHeight } from '../../utils/adaptive';
import PropTypes from 'prop-types';

export default MnemonicConfirmedComponent = (props) => {
    
    return(
        <View style = { styles.mainContainer }>
            <View style = { styles.contentContainer }>
                <View style = { styles.titleContainer } >
                    <Text style = { styles.titleText } >Success!</Text>
                </View>
                <View style = { styles.infoContainer }>
                    <Text style = { styles.infoText }>You’re ready to sign in and start using Storj!</Text>
                </View>
                <View style = { styles.successImageContainer }>
                    <Image
                        source = { require('../../images/RegisterInfoScreens/SuccessImage.png') }
                        style = { styles.successImage }
                        resizeMode = 'contain' />
                </View>
                <TouchableOpacity onPress = { props.screenProps.redirectToLoginScreen }>
                    <View style = { styles.loginButton } >
                        <Text style = { styles.loginButtonText }>Sign in</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    ); 
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
        fontFamily: 'montserrat_bold', 
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
        marginTop: getHeight(5)
    },
    infoText:{
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(23),
        color: '#384B65'
    },
    loginButton: {
        marginTop: getHeight(120),
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
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(14),
        color: 'white'
    },
});

MnemonicConfirmedComponent.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object
}