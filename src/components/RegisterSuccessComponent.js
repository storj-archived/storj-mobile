import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import infoScreensConstants from '../utils/constants/infoScreensConstants';
import { getWidth, getHeight, getDeviceWidth, getDeviceHeight } from '../utils/adaptive';

/**
* RegisterSuccess component
*/
export default class RegisterSuccessComponent extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <View style = { styles.screen }>
                <View style = { styles.backgoundWrapper }>
                    <Image 
                        style = { styles.backgroundImage } 
                        source = { require('../images/RegisterInfoScreens/RegSuccess.png') } />
                </View>
                <View style = { styles.titleBoldContainer }>
                    <Text style = { styles.titleBold }>{ infoScreensConstants.registerSuccessTitleBoldText }</Text>
                </View>
                <View style = { styles.titleLightContainer }>
                    <Text style = { styles.titleBold }>{ infoScreensConstants.registerSuccessTitleLightText }</Text>
                </View>
                <View style = { styles.mainTextContainer }>
                    <Text style = { styles.mainText }>{ infoScreensConstants.registerSuccessMainText }</Text>
                </View>
                <TouchableOpacity style = { styles.nextButton }
                     onPressOut = { () => { this.props.navigation.navigate('MnemonicGenerationScreen') } }>
                    <Text style = { styles.nextButtonText }>NEXT</Text>
                </TouchableOpacity>
            </View>
        );
    }   
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    backgroundImage: {
        top: 0,
        right: 0,
        width: getDeviceWidth(),
        height: getDeviceHeight()
    },
    backgoundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute'
    },
    titleBoldContainer: {
        width: getWidth(200),
        height: getHeight(42),
        marginTop: getHeight(285),
        marginLeft: getWidth(31)
    },
    titleBold: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: getHeight(46),
        color: '#2782ff'
    },
    titleLightContainer: {
        marginTop: getHeight(5),
        width: getWidth(306),
        height: getHeight(42),
        marginLeft: getWidth(31)
    },
    mainTextContainer: {
        marginTop: getHeight(13),
        width: getWidth(310),
        height: getHeight(120),
        marginLeft: getWidth(31)
    },
    mainText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16),
        lineHeight: getHeight(24),
        color: '#384b65'
    },
    nextButton: {
        marginTop: getHeight(69),
        alignSelf: 'center',
        width: getWidth(343),
        height: getHeight(44),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2782ff',
        borderRadius: getWidth(6)
    },
    nextButtonText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: 'white'
    }
});