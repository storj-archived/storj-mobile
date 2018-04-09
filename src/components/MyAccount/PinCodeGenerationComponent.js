import React, { Component } from 'react';
import { 
    Text, 
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput
} from 'react-native';
import { getHeight, getWidth } from '../../utils/adaptive';

export default class PinCodeGenerationComponent extends Component {
    constructor(props) {
        super(props)

        this.letterCount = 4;
        this.HEADER_CHANGE = 'Change PIN';
        this.HEADER_CONFIRM = 'Confirm PIN';
        this.TEXT_ERROR = 'Wrong PIN, try again';
        this.TEXT_REPEAT = 'Repeat new PIN';
        this.TEXT_ENTER = 'Enter new PIN';

        this.state = {
            header: this.HEADER_CHANGE,
            text: this.HEADER_CHANGE,            
            code: [],
            repeatCode: [],
            isValid: true,
            isFinished: false
        };

        this.textInputsRefs = [];
        this.pinCodes = [];
    }

    setErrorState() {
        this.setState({
            isValid: false,
            text: this.TEXT_ERROR,
            code: [],
            repeatCode: [],
            header: this.HEADER_CHANGE
        });
    }    

    checkCodes(newVal) {
        let result;
        
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

        this.setState(prevState => ({ repeatCode: [...prevState.repeatCode, newVal], isFinished: true }));
    }

    handleEdit(newValue) {        
        let codeFull = this.state.code.length === 4;
        let repeatCodeFull = this.state.repeatCode.length === 4;

        if(codeFull && repeatCodeFull) return;

        if(this.state.code.length === 0) {
            this.setState({ header: this.HEADER_CHANGE, text: this.TEXT_ENTER, isValid: true });
        }

        if(this.state.repeatCode.length === 3) {         
            this.checkCodes(newValue);               
            return;
        }

        if(this.state.code.length === 3 && this.state.header !== this.HEADER_CONFIRM) {
            this.setState({ header: this.HEADER_CONFIRM, text: this.TEXT_REPEAT, isValid: true });
        }

        codeFull
            ? this.setState(prevState => ({ repeatCode: [...prevState.repeatCode, newValue] })) 
            : this.setState(prevState => ({ code: [...prevState.code, newValue] }));
    }

    submit() {        
        this.props.navigation.navigate('MyAccountMainPageScreen');
    }
    
    render() {
        const {
            text,
            success,
            pinStyle,
            textStyle,
            errorStyle,
            containerStyle,
            containerPinStyle,
            ...props
        } = this.props;

        let pins = [];

        let currentCodeArray = this.state.code.length === 4 ? this.state.repeatCode : this.state.code;
        
        for (let id = 0; id < this.letterCount; id++) {

            const value = currentCodeArray[id] ? currentCodeArray[id] : '';

            pins.push(
                <View key = { id } style = { styles.pin } >
                    <TextInput
                        style = { value ? styles.inputFilled : null }
                        caretHidden = { true }
                        editable = { !this.state.areInputsBlocked }
                        keyboardType = { 'numeric' }
                        ref = { ref => (this.textInputsRefs[id] = ref) }
                        onChangeText = { this.handleEdit.bind(this) }
                        onFocus = { () => {} }
                        value = { value }
                        returnKeyType = { 'done' }
                        autoCapitalize = { 'sentences' }
                        underlineColorAndroid = { 'transparent' }
                        autoCorrect = { false }
                        autoFocus = { id === 0 && this.props.autoFocusFirst }
                        onKeyPress = { this.onKeyPress }
                    {...props}
                    />
                </View>
            );
        }
        
        return (
            <View style = { styles.mainContainer }>
                <View style = { styles.topContainer } >
                    <View style = { styles.topContentContainer } >
                        <View style = { styles.flexRow }>
                            <TouchableOpacity 
                                onPress = { this.props.screenProps.redirectToSettingsScreen }
                                style = { styles.backButtonContainer } >
                                <Image 
                                    source = { require('../../images/MyAccount/BlueBackButton.png') }
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
                    <View style = { styles.containerPin }>
                        { pins }
                    </View>
                </View>
                <TouchableOpacity onPress = { () => {} }>
                    <View style = { [ styles.saveButton, styles.blurredButton ] } >
                        <Text style = { styles.saveButtonText }>Save</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

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
        fontFamily: 'Montserrat-Bold', 
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
        fontFamily: 'Montserrat-Medium', 
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
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#384B65',
        marginLeft: getWidth(20)
    },
    errorText: {
        fontFamily: 'Montserrat-Regular', 
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
    },
    saveButton: {
        marginTop: getHeight(350),
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
    saveButtonText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: 'white'
    },
    blurredButton: {
        backgroundColor: 'rgba(38, 132, 255, 0.4)', 
        borderColor: '#FFFFFF'
    }
});