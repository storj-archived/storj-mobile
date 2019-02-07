import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Clipboard
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight } from '../../utils/adaptive';
import PropTypes from 'prop-types';


export default class MyAccountMnemonicComponent extends Component {
    constructor(props) {
        super(props);

        /**
         * Local state for changing rendered view
         */
        this.state = {
            mnemonic: null,
            showCopyPopUp: false
        };

        this.secondWordsRowIndexCorrection = 13;

        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.cancelCopy = this.cancelCopy.bind(this);
    }

    async componentDidMount() { 
        this.setState({mnemonic: this.props.screenProps.mnemonic});
    }

    copyToClipboard() {
        Clipboard.setString( this.state.mnemonic );
        this.setState({showCopyPopUp: true});
    }

    cancelCopy() {
        this.setState({showCopyPopUp: false});
    }

    mnemonicToArrayView(mnemonic) {
        let array = mnemonic.split(' ');
        let firstArray = array.slice(0,12);
        let secondArray = array.slice(12);

        return (
            <View style = { styles.mnemonicContainer }>
                <View>
                    {
                        firstArray.map((element, index) => {
                            return (
                                <View key = { index } style = { styles.flexRow }>
                                    <Text style = { styles.index } >{ index + 1 }</Text>
                                    <Text style = { styles.word }>{ element }</Text>
                                </View>
                            )
                        })
                    }
                </View>
                <View style = { styles.secondArrayContainer }>
                    {
                        secondArray.map((element, index) => {  
                            return (
                                <View key = { index } style = { styles.flexRow }>
                                    <Text style = { styles.index } >{ index + this.secondWordsRowIndexCorrection }</Text>
                                    <Text style = { styles.word }>{ element }</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <ScrollView style = { styles.scrollContainer } showsVerticalScrollIndicator = { false } >
                    <View style = { styles.topContainer } >
                        <View style = { styles.topContentContainer } >
                            <View style = { styles.flexRow }>
                                <TouchableOpacity 
                                    onPress = { this.props.screenProps.redirectToMyAccountScreen /* redirectToSettingsScreen */ }
                                    style = { styles.backButtonContainer } >
                                    <Image 
                                        source = { require('../../images/MyAccount/BlueBackButton.png') }
                                        style = { styles.icon } />
                                </TouchableOpacity>
                                <View style = { styles.titleContainer }>
                                    <Text style = { styles.titleText }>Your secret phrase</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style = { styles.additionalTextMargin }>
                        <Text style = { styles.lesserTitleText }>
                            Make sure you 
                            <Text style = { styles.lesserTitleBoldText }> save </Text>
                            this list of words and their order. We don’t want you to lose your data, and you won’t be able to access your data without it.
                        </Text>
                    </View>
                    <View style = { styles.yourMnemonicTextContainer }>
                        <Text style = { styles.yourMnemonicText }>Your secret phrase</Text>
                    </View>
                    {
                        this.state.mnemonic 
                            ? this.mnemonicToArrayView(this.state.mnemonic)
                            : null
                    }
                    <TouchableOpacity onPress = { this.copyToClipboard }>
                        <View style = { styles.copyToClipboardContainer }>
                            <Image
                                style = { styles.icon }
                                source = { require('../../images/RegisterInfoScreens/Clipboard.png') }
                                resizeMode = 'contain' />
                            <Text style = { styles.clipboardText }>Copy to clipboard</Text>
                        </View>
                    </TouchableOpacity>
                    {
                        this.state.showCopyPopUp 
                        ? <View style = { styles.popUpContainer } >
                            <Text style = { styles.popUpInfoText } >Copied to clipboard</Text>
                            <TouchableOpacity onPress = { this.cancelCopy } >
                                <Text style = { styles.popUpCancelText }>OK</Text>
                            </TouchableOpacity>
                        </View> : null
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor: '#FFFFFF',
        paddingHorizontal: getWidth(20)
    },
    topContainer: {
        height: getHeight(80)
    },
    topContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    titleContainer: {
        height: getHeight(65),
        width: getWidth(305),
        marginLeft: getWidth(15)
    },
    titleText: { 
        fontFamily: 'montserrat_bold', 
        fontSize: getHeight(28),
        color: '#384B65' 
    },
    infoContainer: {
        marginTop: getHeight(24),
        height: getHeight(102),
        width: getWidth(335)
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
    lesserTitleText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(25),
        color: '#384B65'
    },
    lesserTitleBoldText: {
        fontFamily: 'montserrat_bold'
    },
    mnemonicContainer: {
        flexDirection: 'row',
        marginTop: getHeight(15),
        height: getHeight(305)
    },
    secondArrayContainer: {
        marginLeft: getWidth(75)
    },
    index: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(25),
        color: 'rgba(56, 75, 101, 0.4)'
    },
    word: {
        marginLeft: getWidth(20),
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(25),
        color: '#384B65'
    },
    copyToClipboardContainer: {
        height: getHeight(55),
        flexDirection: 'row',
        alignItems: 'center'
    },
    clipboardText: {
        marginLeft: getWidth(15),
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#2794FF'
    },
    nextButton: {
        marginTop: getHeight(25),
        marginBottom: getHeight(30),
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
    nextButtonText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(14),
        color: 'white'
    },
    popUpContainer: {
        position: 'absolute',
        bottom: getHeight(10),
        alignSelf: 'center',
        width: getWidth(355),
        height: getHeight(55),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderRadius: getWidth(6),
        borderWidth: getWidth(1.5),
        elevation: 5,
        paddingHorizontal: getWidth(20)
    },
    popUpInfoText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#384B65',
        elevation: 5
    },
    popUpCancelText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#2794FF'
    },
    scrollContainer: {
        marginBottom: getHeight(60),
        backgroundColor: 'transparent'
    },
    additionalTextMargin: {
        marginTop: getHeight(0)
    },
    yourMnemonicTextContainer: {
        marginTop: getHeight(17)
    },
    yourMnemonicText: {
        fontFamily: 'montserrat_medium', 
        fontSize: getHeight(12), 
        lineHeight: getHeight(15),
        color: 'rgba(56, 75, 101, 0.4)'
    }
});

MyAccountMnemonicComponent.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object
};