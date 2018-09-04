import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Platform,
    Dimensions
} from 'react-native';
import React, { Component } from 'react';
import ContentSlider from '../components/ContentSliderComponent';
import onBoardingScreensConstants from '../utils/constants/onBoardingScreeensConstants';
import { getDeviceWidth, getWidth, getHeight } from '../utils/adaptive';
import { NavigationActions } from 'react-navigation';
import SideSwipe from '../components/SideSwipeComponent';


OnBoardingScreen = (props) => {
    return(
        <View style = { styles.contentContainer }>
            <View style = { styles.imageContainer }>
                <Image style = { styles.image } source = { props.imagePath } resizeMode = { 'contain' } />
            </View>
            <View style={ styles.textContainer }>
                <Text style = { styles.textInfo }>{ props.textArray }</Text>
            </View>
        </View>
    );
};

PaginationComponent = (props) => {
    return(<View style = { styles.paginationCompContainer }>
                <View style = {[ styles.paginationComponent, { backgroundColor: props.color }]} />
            </View>
    );
}

/**
 * OnBoarding component, using SliderComponent to switch between 1 and 2 content screens, described above
 */
export default class OnBoardingComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentIndex: 0
        }

        this.data = [
            { imagePath: onBoardingScreensConstants.safetyImagePath, textArray: onBoardingScreensConstants.safetyMainText },
            { imagePath: onBoardingScreensConstants.incomeImagePath, textArray: onBoardingScreensConstants.incomeMainText },
            { imagePath: onBoardingScreensConstants.spaceImagePath, textArray: onBoardingScreensConstants.spaceMainText }
        ];
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
        this.props.screenProps.redirectToLoginScreen();
    }

    /**
     * Navigation to RegisterScreen
     */
    redirectToSingUpScreen() {
        this.props.screenProps.redirectToRegisterScreen();
    }

    render() {
        const { width } = Dimensions.get('window');

        return(
            <View style={ styles.screen }>
                <View style = { styles.titleContainer }>
                    <Text style = { styles.titleText }>Welcome to Storj!</Text>
                </View>
                <View style={ styles.content }>
                    <SideSwipe
                        index = { this.state.currentIndex }
                        itemWidth = { getWidth(351) }
                        contentOffset = { 0 }
                        data = { this.data }
                        threshold = { getWidth(50) }
                        onIndexChange={ index => {
                            let finalIndex = this.state.currentIndex;

                            if(index === finalIndex) return;

                            index >= finalIndex 
                                ? finalIndex += 1
                                : finalIndex -= 1;

                            this.setState(() => ({ currentIndex: finalIndex }))
                            
                        }}
                        renderItem = { ({ itemIndex, currentIndex, item, animatedValue }) => (
                            OnBoardingScreen(item)
                        )} />
                    <View style = { styles.paginationContainer }>
                        {
                            this.data.map((element, index) => {
                                return(
                                    <PaginationComponent
                                        key = { index }
                                        color = { index === this.state.currentIndex ? '#939BA6' : '#FFFFFF' } />
                                )
                            })
                        }
                    </View>
                </View>
                <View style={ styles.footer }>                   
                    <TouchableOpacity 
                        style={ [ styles.button, styles.buttonLogin ] } 
                        onPress = { this.redirectToSingInScreen.bind(this) }>
                            <Text style={ styles.loginText }>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={ [ styles.button, styles.buttonSignUp ] } 
                        onPress = { this.redirectToSingUpScreen.bind(this) }>
                            <Text style={ styles.signUpText }>Create account</Text>
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
    contentPadding: getWidth(20),
    contentPaddingVertical: getHeight(10),
    titleBoldSize: getHeight(30),
    text: getHeight(16),
    buttonText: getHeight(14),
    imageTopPadding: getHeight(60),
    colorBlue: '#2794FF',
    colorDarkBlue: '#384b65',
    buttonPaddingHorizontal: getWidth(20)
};

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: getWidth(20),
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        backgroundColor: 'transparent',
        flex: 1
    },
    titleContainer: {
        marginTop: getHeight(30),
        justifyContent: 'flex-start'
    },
    titleText: {
        fontFamily: 'montserrat_bold', 
        fontSize: getHeight(30),
        color: '#384B65'
    },
    footer: {
        justifyContent: 'center',
        flexDirection: 'row',
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
        fontFamily: 'montserrat_bold',
        fontSize: params.buttonText,
        color: params.colorBlue
    },
    signUpText: {
        fontFamily: 'montserrat_bold',
        fontSize: params.buttonText,
        color: 'white'
    },
    buttonSignUp: {
        backgroundColor: params.colorBlue
    },
    contentContainer: {
        marginLeft: Platform.OS === 'ios' ? getWidth(5) : 0 ,
        flex: 1,
        paddingVertical: params.contentPaddingVertical
    },
    imageContainer: {
        marginTop: getHeight(25),
        marginRight: getWidth(10),
        justifyContent: 'center'
    },
    textContainer: {
        backgroundColor: 'transparent',
        marginTop: getHeight(20),
        height: getHeight(80),
        paddingHorizontal: getWidth(5),
        width: getWidth(335),
        alignItems: 'flex-start'
    },
    titleBold: {
        fontFamily: 'montserrat_extrabold',   
        alignSelf: 'flex-start',  
        fontSize: params.titleBoldSize,
        color: '#384B65'
    },
    titleLight: {
        fontFamily: 'montserrat_extrabold',
        fontSize: params.titleBoldSize,
        color: params.colorBlue,
        backgroundColor: 'transparent'
    },
    textInfo: {
        fontFamily: 'montserrat_regular',
        lineHeight: getHeight(25),
        fontSize: params.text,
        color: params.colorDarkBlue
    },
    image: {
        height: getHeight(250),
        width: getWidth(335)
    },
    paginationContainer: { 
        marginTop: getHeight(10), 
        height: getHeight(20), 
        width: getDeviceWidth() - getWidth(40), 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    paginationCompContainer: {
        width: getWidth(17), 
        alignItems: "center"
    },
    paginationComponent: { 
        height: getHeight(7), 
        width: getWidth(7), 
        borderRadius: 50, 
        borderWidth: 1,
        borderColor: '#C6D5DF' 
    }
});

