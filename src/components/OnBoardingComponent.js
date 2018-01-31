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

/**
 * Content of 1 onBoarding screen
 */
SafetyOnBoardingScreen = () => {
    return(
        <View style={ styles.contentContainer }>
            <View style={ styles.imageContainer }>
                <Image style={ styles.image } source={ onBoardingScreensConstants.safetyImagePath } />
            </View>
            <View>
                <Text style={ styles.titleBold }>{ onBoardingScreensConstants.safetyBoldTitle }</Text>
            </View>
            <View style={ styles.textContainer }>
            {
                onBoardingScreensConstants.safetyMainText.map((element, index) => {
                    return <Text 
                    key = {index} style={ styles.textInfo }>{ element }</Text>
                })
            }
            </View>
        </View>
    );
};

/**
 * Content of 2 onBoarding screen
 */
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
            {
                onBoardingScreensConstants.incomeMainText.map((element, index) => {
                    return <Text key = {index} style={ styles.textInfo }>{ element }</Text>
                })
            }
            </View>
        </View>
    );
};

/**
 * OnBoarding component, using SliderComponent to switch between 1 and 2 content screens, described above
 */
export default class OnBoardingComponent extends Component {
    constructor(props) {
        super(props);
    };

    /**
     * hiding navigation header
     */
    static navigationOptions = {
        header: null
    };
    
    /**
     * Navigation to LoginScreen
     */
    redirectToSingInScreen() {
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'LoginScreen'})
            ]
        }));
    }

    /**
     * Navigation to RegisterScreen
     */
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
                    <TouchableOpacity 
                        style={ [ styles.button, styles.buttonLogin ] } 
                        onPress = { this.redirectToSingInScreen.bind(this) }>
                            <Text style={ styles.loginText }>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={ [ styles.button, styles.buttonSignUp ] } 
                        onPress = { this.redirectToSingUpScreen.bind(this) }>
                            <Text style={ styles.signUpText }>Signup</Text>
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
    titleBoldSize: getHeight(28),
    text: getHeight(16),
    buttonText: getHeight(14),
    imageTopPadding: getHeight(60),
    colorBlue: '#2794FF',
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
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    titleBold: {
        fontFamily: 'Montserrat-ExtraBold',   
        alignSelf: 'center',  
        marginTop: getHeight(30),
        fontSize: params.titleBoldSize,
        color: '#384B65'
    },
    titleLight: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: params.titleBoldSize,
        color: params.colorBlue,
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

