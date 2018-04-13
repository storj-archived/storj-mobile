import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import React, { Component } from 'react';
import InputComponent from '../components/InputComponent';
import { getWidth, getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';

export default class InitializeComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isKeyboardShown: false
        }
    };

    componentWillMount() {
        this.keyboardListenerShow = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({isKeyboardShown: true})
        });

        this.keyboardListenerHide = Keyboard.addListener('keyboardDidHide', () => {
            this._inputComponent._textInput.blur();
            this.setState({isKeyboardShown: false})
        });
    }

    componentWillUnmount() {
        if(this.keyboardListenerShow) this.keyboardListenerShow.remove();
        if(this.keyboardListenerHide) this.keyboardListenerHide.remove();
        Keyboard.dismiss();
    }

    render() {
        return(
            <ScrollView style={ styles.mainContainer } keyboardDismissMode = { "interactive" }>
                    <View style = { styles.backgroundWrapper }>
                        <Image 
                            style = { styles.logo } 
                            source = { require('../images/Icons/LogoBlue.png') } 
                            resizeMode = 'contain' />
                    </View>
                    {
                        (()=>{
                            if(this.props.enterPassCode){
                                return(
                                    <View style = { styles.contentWrapper }>
                                        <View style = { styles.titleContainer }> 
                                            <Text style = { styles.titleText }>Sign in</Text>
                                        </View>
                                        <View style = { styles.contentContainer } >
                                            <Text style = { !this.props.isError ? styles.infoText : [ styles.infoText, { color: '#EB5757' } ] }>{ this.props.infoText }</Text>
                                            <TouchableOpacity onPress = { () => {
                                                if(!this.state.isKeyboardShown) {
                                                    this._inputComponent._textInput.blur();
                                                    this._inputComponent._textInput.focus();
                                                }
                                            } } style = { { backgroundColor: '#FFFFFF' } } >
                                                <View style = { styles.containerPin }>
                                                    {
                                                        (
                                                            () => {
                                                                return new Array(4).fill(' ').map((element, index) => {
                                                                    return(
                                                                        this.props.filledPins[index] ?
                                                                            <View 
                                                                                key = { index } 
                                                                                style = { styles.pin }>
                                                                                <View style = { styles.inputFilled } />
                                                                            </View> :
                                                                            <View 
                                                                                key = { index } 
                                                                                style = { styles.pin } /> 
                                                                            
                                                                    )
                                                                })
                                                            }
                                                        )()
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                            <InputComponent 
                                                ref = { component => this._inputComponent = component }
                                                inputStyle = { styles.pincodeInputStyle }
                                                onChangeText = { value => this.props.onChangePasscode(value) }
                                                autoFocus = { true }
                                                keyboardType = { 'numeric' }
                                                placeholder = {'Passcode'} 
                                                value = { this.props.filledPins }
                                                isError = { this.props.isPasscodeWrong }
                                                errorMessage = {'Invalid filledPins'} />
                                        </View>
                                        {
                                            this.state.isKeyboardShown ? null :
                                                <View style = { styles.buttonBlock } >
                                                    <TouchableOpacity 
                                                        style = { styles.buttonContainer } 
                                                        onPressOut = { () => this.props.redirectToLoginScreen() }>
                                                            <Text style = { styles.buttonText }>Log in via password</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity 
                                                        style = { [styles.buttonContainer, { marginTop: getHeight(10) } ] } 
                                                        onPressOut = { () => this.props.redirectToQRScannerScreen() }>
                                                            <Text style = { styles.buttonText }>Log in via QR code</Text>
                                                    </TouchableOpacity>
                                                    <Text style = { styles.footerText }>Don't have an account? <Text onPress = { () => this.props.redirectToRegisterScreen() } style = { styles.footerLink }>Sign Up</Text></Text>
                                                </View>
                                        }
                                    </View>
                                );
                            }
                        })()
                    }  
                    {
                        this.props.isLoading ?
                            <View style = { [ styles.backgroundWrapper ] }>
                                <View style = { [ styles.backgroundWrapper, styles.dimBlack ] } />
                                <View style = { [ styles.backgroundWrapper, styles.setChildCenter ] }>
                                    <ActivityIndicator animating = { true } color = { "#2782ff" } size = { "large" }/>
                                </View>
                            </View> : null
                    }               
                </ScrollView>
        ) 
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    backgroundWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        height: getHeight(100),
        marginBottom: getHeight(160)
    },
    splash: {
        height: getHeight(667),
        width: getWidth(375)
    },
    splashLogo: {
        marginTop: getHeight(268),
        marginBottom: getHeight(321),
        marginLeft: getWidth(114),
        marginRight: getWidth(87),
        height: getHeight(78),
        width: getWidth(174)
    },
    contentWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: getWidth(20)
    },
    titleContainer: {
        marginTop: getHeight(15),
        height: getHeight(45)
    },
    titleText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(30),
        color: '#384B65'
    },
    contentContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    infoText: {
        marginTop: getHeight(125),
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16),
        color: '#384B65'
    },
    buttonBlock: {
        position: 'absolute',
        bottom: getHeight(20),
        paddingHorizontal: getWidth(20),
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    buttonContainer: {
        width: getWidth(343),
        height: getHeight(55),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: getWidth(8),
        borderWidth: getWidth(1.5),
        borderColor: '#2794FF'
    },
    buttonText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(16),
        color: '#2794FF'
    },
    pincodeInputStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: getHeight(1),
        width: getWidth(1)
    },
    containerPin: {
        flexDirection: 'row',
        marginRight: getWidth(35),
        marginTop: getHeight(25),
        backgroundColor: '#FFFFFF'
    },
    pin: {
        backgroundColor : '#FFFFFF',
        height: getHeight(30),
        width: getWidth(30),
        marginLeft: getWidth(40),
        borderRadius: 50,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputFilled : { 
        backgroundColor: 'black', 
        borderRadius: 50, 
        height: getHeight(18), 
        width: getWidth(18)
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.3
    },
    setChildCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16),
        color: '#384B65',
        marginTop: getHeight(15)
     },
    footerLink: {
        fontFamily: 'Montserrat-Bold',
        color: '#2794FF'
    }
});

InitializeComponent.propTypes = {
    enterPassCode: PropTypes.bool,
    isError: PropTypes.bool,
    filledPins: PropTypes.string,
    onChangePasscode: PropTypes.func,
    isPasscodeWrong: PropTypes.bool,
    isLoading: PropTypes.bool,
    infoText: PropTypes.string,
    redirectToLoginScreen: PropTypes.func,
    redirectToQRScannerScreen: PropTypes.func,
    redirectToRegisterScreen: PropTypes.func
};