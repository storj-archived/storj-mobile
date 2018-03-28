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

        this.state = {
            isError: false,
            text: this.props.text,
            number: 4,
            code: new Array(4),
            edit: 0,
            areInputsBlocked: false
        };

        this.textInputsRefs = [];
        this.pinCodes = [];

        this.clean = this.clean.bind(this);
        this.focus = this.focus.bind(this);
        this.isFocus = this.isFocus.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    submit() {
        this.props.navigation.navigate('MyAccountMainPageScreen');
    }

    clean() {
        this.setState(prevState => {
            return {
                code: new Array(prevState.number),
                edit: 0
            };
        });
        this.focus(0);
    }

    focus(id) {
        this.textInputsRefs[id].focus();
    }

    isFocus(id) {
        let newCode = this.state.code.slice();

        for (let i = 0; i < newCode.length; i++) if (i >= id) newCode[i] = '';

        this.setState({
            code: newCode,
            edit: id
        });
    }

    handleEdit(number, id) {
        let newCode = this.state.code.slice();
        newCode[id] = number;

        // User filling the last pin ?
        if(id === this.state.number - 1) {

            if(newCode[3] != "") {
                this.setState({text: 'Confirm new PIN'})
    
                if(this.pinCodes.length < 2 ) {
                    this.pinCodes.push(newCode);
    
                    if(this.pinCodes.length === 2) {
                        let arePinCodesMatches = this.pinCodes[0].join('') === this.pinCodes[1].join('');
    
                        if(arePinCodesMatches) {
                            this.setState({areInputsBlocked: true, text: 'Success!'});
                        } else {
                            this.setState({text: 'PIN doesn`t match, try again', isError: true})
                            this.pinCodes = [];
                        }
                    }
                }
            }
            this.focus(0);
            
            return;
        }

        if(this.state.text === 'PIN doesn`t match, try again') {
            this.setState({text: 'Enter new PIN', isError: false})
        }

        this.focus(this.state.edit + 1);

        this.setState(prevState => {
            return {
                code: newCode,
                edit: prevState.edit + 1
            };
        });
    }

    onKeyPress(e) {
        if (e.nativeEvent.key === 'Backspace') {
            const edit = this.state.edit;
            const toFocus = edit > 0 ? edit - 1 : 0;
            this.focus(toFocus);
        }
    }

    render() {
        const {
            text,
            success,
            pinStyle,
            textStyle,
            errorStyle,
            obfuscation,
            containerStyle,
            containerPinStyle,
            ...props
        } = this.props;

        pins = [];

        for (let index = 0; index < this.state.number; index++) {
        const id = index;
        const value = this.state.code[id]
            ? obfuscation ? '*' : this.state.code[id]
            : '';
        pins.push(
            <View key={id} style={styles.pin} >
                <TextInput
                    style = { this.state.code[id] !== '' || this.pinCodes.length === 2
                        ? styles.inputFilled 
                        : null }
                    caretHidden = { true }
                    editable = { !this.state.areInputsBlocked }
                    keyboardType = { 'numeric' }
                    ref={ref => (this.textInputsRefs[id] = ref)}
                    onChangeText={(text) => { this.handleEdit(text, id);}}
                    onFocus={() => this.isFocus(id)}
                    value={value}
                    returnKeyType={ 'done' }
                    autoCapitalize={ 'sentences' }
                    underlineColorAndroid = { 'transparent' }
                    autoCorrect={false}
                    autoFocus={id === 0 && this.props.autoFocusFirst}
                    onKeyPress={this.onKeyPress}
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
                                onPress = { () => { this.props.navigation.goBack(); } }
                                style = { styles.backButtonContainer } >
                                <Image 
                                    source = { require('../../images/MyAccount/BlueBackButton.png') }
                                    style = { styles.icon } />
                            </TouchableOpacity>
                            <View>
                                <Text style = { [styles.titleText, styles.titleMargin] }>Secret phrase</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.container, containerStyle]}>
                    <Text style={!this.state.isError ? [styles.text, textStyle] : styles.errorText}>{this.state.text}</Text>
                    <View style={styles.containerPin}>
                        {pins}
                    </View>
                </View>
                <TouchableOpacity onPress = { () => {} }>
                    <View style = { 
                            [ styles.saveButton, styles.blurredButton ] 
                        } >
                        <Text style = { styles.saveButtonText }>Save</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

PinCodeGenerationComponent.defaultProps = {
    code: '',
    number: 4,
    checkPinCode: null,
    autoFocusFirst: true,
    obfuscation: false,
    text: 'Enter new PIN',
    pinStyle: {},
    containerPinStyle: {},
    containerStyle: {},
    textStyle: {},
    errorStyle: {}
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
