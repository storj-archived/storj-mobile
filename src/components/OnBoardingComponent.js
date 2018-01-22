import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';
import React, { Component } from 'react';
import ContentSlider from '../components/ContentSliderComponent';
import onBoardingScreensConstants from '../utils/constants/onBoardingScreeensConstants';
import { getDeviceWidth, getWidth, getHeight } from '../utils/adaptive';
import { NavigationActions } from 'react-navigation';

SafetyOnBoardingScreen = () => {
    return(
        <View style={ styles.contentContainer }>
            <View style={ styles.imageContainer }>
                <Image style={ styles.image } source={ onBoardingScreensConstants.safetyImagePath } />
            </View>
            <View>
                <Text style={ styles.titleBold }>{ onBoardingScreensConstants.safetyBoldTitle }</Text>
                <Text style={ styles.titleLight }>{ onBoardingScreensConstants.safetySemiBoldTitle }</Text>
            </View>
            <View style={ styles.textContainer }>
                <Text style={ styles.textInfo }>{ onBoardingScreensConstants.safetyMainText }</Text>
            </View>
        </View>
    );
};

IncomeOnBoardingScreen = () =>  {
    return(
        <View style={ styles.contentContainer }>
            <View style={ styles.imageContainer }>
                <Image style={ styles.image } source={ onBoardingScreensConstants.incomeImagePath } />
            </View>
            <View>
                <Text style={ styles.titleBold }>{ onBoardingScreensConstants.incomeBoldTitle }</Text>
                <Text style={ styles.titleLight }>{ onBoardingScreensConstants.incomeSemiBoldTitle }</Text>
            </View>
            <View style={ styles.textContainer }>
                <Text style={ styles.textInfo }>{ onBoardingScreensConstants.incomeMainText }</Text>
            </View>
        </View>
    );
};

export default class OnBoardingComponent extends Component {
    constructor(props) {
        super(props);
    };

    static navigationOptions = {
        header: null
    };
    
    redirectToSingInScreen() {
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'LoginScreen'})
            ]
        }));
    }

    redirectToSingUpScreen() {
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'RegisterScreen'})
            ]
        }));
    }

    render() {
        return(
            <View style={ styles.screen }>
                <View style={ styles.content }>
                    <ContentSlider
                        content = {[ SafetyOnBoardingScreen(), IncomeOnBoardingScreen() ]}
                        width = { getDeviceWidth() }
                        position = { 0 } />  
                </View>
                <View style={ styles.footer }>                   
                        <TouchableOpacity style={ [ styles.button, styles.buttonLogin ] } onPress = { this.redirectToSingInScreen.bind(this) }>
                                <Text style={ styles.loginText }>SIGN IN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ [ styles.button, styles.buttonSignUp ] } onPress = { this.redirectToSingUpScreen.bind(this) }>
                                <Text style={ styles.signUpText }>SIGN UP</Text>
                        </TouchableOpacity>
                </View>
            </View>
        );
    };
}

const params = {
    buttonHeight: getHeight(44),
    buttonBorderRadius: getWidth(8),
    buttonFlex: 0.432,
    footerFlex: 0.15,
    contentPadding: getWidth(37),
    contentPaddingVertical: getHeight(10),
    titleBoldSize: getHeight(46),
    titleSide: getHeight(30),
    text: getHeight(16),
    buttonText: getHeight(14),
    imageTopPadding: getHeight(60),
    colorBlue: '#2782ff',
    colorDarkBlue: '#384b65',
    buttonPaddingHorizontal: getWidth(20)
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        backgroundColor: 'transparent',
        flex: 1
    },
    footer: {
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: getWidth(20),
        paddingVertical: getHeight(25),
        height: getHeight(94)
    },
    button: {
        width: getWidth(162),
        borderRadius: params.buttonBorderRadius,
        height: params.buttonHeight,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonLogin: {
        marginRight: getWidth(11),
        borderWidth: 1,
        borderColor: params.colorBlue
    },
    loginText: {
        fontFamily: 'Montserrat-Bold',
        fontWeight: 'bold',
        fontSize: params.buttonText,
        color: params.colorBlue
    },
    signUpText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: params.buttonText,
        color: 'white'
    },
    buttonSignUp: {
        backgroundColor: params.colorBlue
    },
    contentContainer: {
        flex: 1,
        paddingVertical: params.contentPaddingVertical,
        paddingHorizontal: params.contentPadding
    },
    imageContainer: {
        position: 'absolute',
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    textContainer: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'flex-end'
    },
    titleBold: {
        fontFamily: 'Montserrat-ExtraBold',       
        marginTop: getHeight(23),
        fontSize: params.titleBoldSize,
        color: params.colorBlue
    },
    titleLight: {
        fontFamily: 'Montserrat-Light',
        lineHeight: getHeight(36),
        fontSize: params.titleSide,
        color: params.colorDarkBlue,
        backgroundColor: 'transparent'
    },
    textInfo: {
        fontFamily: 'Montserrat',
        lineHeight: getHeight(24),
        fontSize: params.text,
        color: params.colorDarkBlue
    },
    image: {
        marginTop: params.imageTopPadding
    }
});

