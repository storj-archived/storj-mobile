import React, { Component } from 'react';
import { 
    Text, 
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Keyboard,
    TextInput
} from 'react-native';
import StorjModule from '../../../../utils/storjModule';
import { getHeight, getWidth } from '../../../../utils/adaptive';
import PropTypes from 'prop-types';

export default class PinCodeGenerationComponent extends Component {
    constructor(props) {
        super(props);

        this.letterCount = 4;
        this.HEADER_CHANGE = 'Change PIN';
        this.HEADER_CONFIRM = 'Confirm PIN';
        this.TEXT_ERROR = 'Wrong PIN, try again';
        this.TEXT_REPEAT = 'Repeat new PIN';
        this.TEXT_ENTER = 'Enter new PIN';
        this.SUCCESS = 'Success!';

        this.state = {
            header: this.HEADER_CHANGE,
            text: this.HEADER_CHANGE,            
            code: [],
            repeatCode: [],
            isValid: true,
            isFinished: false
        };

        this.isCleared = false;

        this.textInputsRefs = [];
        this.pinCodes = [];
        this.handleEdit = this.handleEdit.bind(this);
        this._onRef = this._onRef.bind(this);
        this.onPress = this.onPress.bind(this);

        this.isKeyboardShown = false;
    }

    componentWillMount() {
        this.keyboardListenerShow = Keyboard.addListener('keyboardDidShow', () => {
            this.isKeyboardShown = true;
        });

        this.keyboardListenerHide = Keyboard.addListener('keyboardDidHide', () => {
            this._textInput.blur();
            this.isKeyboardShown = false;
        });
    }

    componentWillUnmount() {
        if(this.keyboardListenerShow) this.keyboardListenerShow.remove();
        if(this.keyboardListenerHide) this.keyboardListenerHide.remove();
    }

    _onRef(ref) {
        this._textInput = ref;
    }

    onPress() {
        if(this.isKeyboardShown) return;

        this._textInput.blur();
        this._textInput.focus();
    }

    setErrorState() {
        this._textInput.clear();
        this.setState({
            isValid: false,
            text: this.TEXT_ERROR,
            code: [],
            repeatCode: [],
            header: this.HEADER_CHANGE
        });
    }    

    setEmptyState() {
        this.setState({
            isValid: true,
            text: this.TEXT_ENTER,
            code: [],
            repeatCode: [],
            header: this.HEADER_CHANGE
        });
    }    

    checkCodes(newVal) {
        for(let i = 0; i < this.letterCount - 1; i++) {
            if(this.state.code[i] !== this.state.repeatCode[i]) {                                
                this.setErrorState(); 
                return;
            }
        }

        if(this.state.code[this.letterCount - 1] !== newVal) {
            this.setErrorState(); 
            return;
        }

        this.setState(prevState => ({ repeatCode: [...prevState.repeatCode, newVal], isFinished: true, text: this.SUCCESS }));
        Keyboard.dismiss();
        this.onSubmit();
    }

    handleEdit(newValue) { 
        if((!this.isCleared && newValue === '') || !['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(newValue[newValue.length - 1])) return;
       
        this.isCleared = this.isCleared ? false : true;

        let codeFull = this.state.code.length === this.letterCount;
        let repeatCodeFull = this.state.repeatCode.length === this.letterCount;
        let newCodeArray = codeFull ? this.state.repeatCode : this.state.code;

        if(codeFull && repeatCodeFull) return;

        if(this.state.code.length === 3 && newValue.length === 4) {
            this._textInput.clear();
        }

        if(newValue.length === newCodeArray.length - 1) {
            this.isCleared = true;
            this._textInput.clear();
            this.setEmptyState();
            return;
        };

        newValue = newValue[newValue.length - 1];

        if(this.state.code.length === 0) {
            this.setState({ header: this.HEADER_CHANGE, text: this.TEXT_ENTER, isValid: true });
        }

        if(this.state.repeatCode.length === this.letterCount - 1) {         
            this.checkCodes(newValue);               
            return;
        }

        if(this.state.code.length === this.letterCount - 1 && this.state.header !== this.HEADER_CONFIRM) {
            this.setState({ header: this.HEADER_CONFIRM, text: this.TEXT_REPEAT, isValid: true });
        }

        codeFull
            ? this.setState(prevState => ({ repeatCode: [...prevState.repeatCode, newValue] })) 
            : this.setState(prevState => ({ code: [...prevState.code, newValue] }));
    }

    onSubmit() {    
        let email = this.props.screenProps.email;
        let password = this.props.screenProps.password;
        let mnemonic = this.props.screenProps.mnemonic;

        StorjModule.importKeys(
            email,
            password,
            mnemonic,
            this.state.code.join('')
        ).then(() => {
            this.props.screenProps.redirectToSettingsScreen();
        });
    }

    renderPins() {
        let currentCodeArray = this.state.code.length === 4 ? this.state.repeatCode : this.state.code;
        
        return new Array(this.letterCount).fill(' ').map((element, index) => {
            return(
                currentCodeArray[index] ?
                    <View 
                        key = { index } 
                        style = { styles.pin }>
                        <View style = { styles.inputFilled } />
                    </View> :
                    <View 
                        key = { index } 
                        style = { styles.pin } /> 
            )
        });
    }
    
    render() {
        const {
            textStyle,
            containerStyle
        } = this.props;
        
        return (
            <View style = { styles.mainContainer }>
                <View style = { styles.topContainer } >
                    <View style = { styles.topContentContainer } >
                        <View style = { styles.flexRow }>
                            <TouchableOpacity 
                                onPress = { this.props.screenProps.redirectToSettingsScreen }
                                style = { styles.backButtonContainer } >
                                <Image 
                                    source = { require('../../../../images/MyAccount/BlueBackButton.png') }
                                    style = { styles.icon } />
                            </TouchableOpacity>
                            <View>
                                <Text style = { [styles.titleText, styles.titleMargin] }>{ this.state.header }</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.container, containerStyle]}>
                    <Text style = { this.state.isValid ? [styles.text, textStyle] : styles.errorText }>{ this.state.text }</Text>
                    <TouchableOpacity 
                        onPress = { this.onPress }>
                        <View style = { styles.containerPin }>
                            {
                                this.renderPins()
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                <TextInput 
                    ref = { this._onRef }
                    style = { { position: 'absolute', right: 0, top: 0, height: 1, width:1 } }
                    caretHidden = { true }
                    onChangeText = { this.handleEdit }
                    returnKeyType = { 'done' }
                    autoCapitalize = { 'sentences' }
                    underlineColorAndroid = { 'transparent' }
                    blurOnSubmit = {false}
                    autoCorrect = { false }
                    autoFocus = { true }
                    keyboardType = { 'numeric' }
                    withRef  />
            </View>
        );
    }
}

PinCodeGenerationComponent.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: getHeight(20)
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
        lineHeight: getHeight(33),
        color: '#384B65' 
    },
    titleMargin: {
        marginLeft: getWidth(20),
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    cancelText: {
        fontFamily: 'montserrat_medium', 
        fontSize: getHeight(18), 
        lineHeight: getHeight(22),
        color: '#2794FF'
    },
    container: {
        height: getHeight(80),
        marginRight: getWidth(40),
        width: getWidth(300),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerPin: {
        flexDirection: 'row',
        marginHorizontal: getWidth(15),
        marginTop: getHeight(25),
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
    text: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#384B65',
        marginLeft: getWidth(20)
    },
    errorText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#EB5757',
        marginLeft: getWidth(20)
    },
    error: {
        textAlign: 'center', 
        color: 'red', 
        paddingTop: getHeight(10)
    },
    inputFilled : { 
        backgroundColor: 'black', 
        borderRadius: 50, 
        height: getHeight(18), 
        width: getWidth(18)
    }
});