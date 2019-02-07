import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React from 'react';
import { getWidth, getHeight, getDeviceWidth, getDeviceHeight } from '../../utils/adaptive';

/**
 * RegisterFailure component
 */
const AuthFailureComponent = (props) => { 
    return(
        <View style = { styles.screen }>
            <View style = { styles.content }>
                <View style = { styles.imageContainer }>
                    <Image style = { styles.attentionImage } source = { require('../../images/Register/Attention.png') }/>
                </View>
                <View style = { styles.titleBoldContainer }>
                    <Text style = { styles.titleBold }>{ props.navigation.state.params.mainText }</Text>
                </View>
                <View style = { styles.titleLightContainer }>
                    <Text style = { styles.titleLight }>{ props.navigation.state.params.additionalText }</Text>
                </View>
            </View>
            <View style = { styles.footer }>
                <TouchableOpacity style = { styles.tryAgainButton } onPress = { props.screenProps.redirectToLoginScreen }>
                    <Text style = { styles.tryAgainText }>TRY AGAIN</Text>
                </TouchableOpacity>  
            </View>
        </View>
    );
};

export default AuthFailureComponent;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        backgroundColor: 'transparent'
    },
    imageContainer: {
        marginTop: getHeight(96),
        marginLeft: getWidth(16)
    },
    attentionImage: {
        width: getWidth(127),
        height: getHeight(136)
    },
    titleBoldContainer: {
        width: getWidth(300),
        height: getHeight(84),
        marginTop: getHeight(82.8),
        marginLeft: getWidth(31)
    },
    titleBold: {
        fontFamily: 'montserrat_light',
        lineHeight: getHeight(42),
        fontSize: getHeight(30),
        color: '#384b65',
        backgroundColor: 'transparent',
    },
    titleLightContainer: {
        width: getWidth(275),
        height: getHeight(72),
        marginTop: getHeight(20),
        marginLeft: getWidth(31)
    },
    titleLight: {
        fontFamily: 'Montserrat',
        lineHeight: getHeight(24),
        fontSize: getHeight(16),
        color: '#384b65',
        backgroundColor: 'transparent',
    },
    footer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: getHeight(64)
    },
    tryAgainButton: {
        width: getWidth(343),
        height: getHeight(55),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2782ff',
        borderRadius: getWidth(6)
    },
    tryAgainText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(14),
        color: 'white'
    }
});