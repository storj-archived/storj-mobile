import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Clipboard,
    Linking,
    Alert
} from 'react-native';
import React, { Component } from 'react';
import { WORDLIST } from '../../utils/constants/wordList';
import mnemonicScreenConstants from '../../utils/constants/mnemonicScreenConstants';
import { getWidth, getHeight } from '../../utils/adaptive';
import PropTypes from 'prop-types';

export default class MnemonicConfirmationComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mnemonic: this.props.navigation.state.params.mnemonic.split(' '),
            showFirstSet: false,
            showSecondSet: false,
            firstWord: '',
            secondWord: ''
        }

        this.WORD_NUMBER = 'Word #';
        this.data = this.getWords();
    }

    componentDidMount() {
        this.setState({
            firstWord: this.WORD_NUMBER + this.data.firstWordIndex,
            secondWord: this.WORD_NUMBER + this.data.secondWordIndex
        })
    }

    setNewData() {
        this.data = this.getWords();
        this.setState({
            firstWord: this.WORD_NUMBER + this.data.firstWordIndex,
            secondWord: this.WORD_NUMBER + this.data.secondWordIndex
        });
    }

    getWords() {
        let mnemonic = this.state.mnemonic.slice();
        let firstRightWord = this.getRandomWord(mnemonic);
        mnemonic.splice(mnemonic.indexOf(firstRightWord), 1);
        let secondRightWord = this.getRandomWord(mnemonic);

        let wordSet = WORDLIST;
        let result = [];

        while (result.length < 4) {
            let newWord = this.getRandomWord(wordSet);
            wordSet.splice(wordSet.indexOf(newWord), 1);

            if(newWord !== firstRightWord && newWord !== secondRightWord) {
                result.push(newWord);
            }
        };

        return { 
            firstWordIndex: this.state.mnemonic.indexOf(firstRightWord) + 1,
            secondWordIndex: this.state.mnemonic.indexOf(secondRightWord) + 1,
            firstSet: [ firstRightWord, result[0], result[1] ], 
            secondSet: [ secondRightWord, result[2], result[3] ] 
        }
    }

    getRandomWord(array) {
        return array[Math.floor(Math.random() * (array.length - 1))]
    }

    getWordPopUpData(params) {
        return (
            <View style = { styles.popUpContainer } >
                {
                    params.data.sort().map((element, index) => {
                        return(
                            WordContainer(element, index, params.setWord)
                        )
                    })
                }
            </View>
        )
    }

    setFirstWord(word) {
        this.setState({firstWord: word, showFirstSet: false});
    }

    setSecondWord(word) {
        this.setState({secondWord: word, showSecondSet: false});
    }

    showFirstSet() {
        this.setState({showFirstSet: true});
    }

    showSecondSet() {
        this.setState({showSecondSet: true});
    }

    checkBothWordsInputed() {
        let result = this.containWord(this.state.firstWord, this.WORD_NUMBER) && 
                      this.containWord(this.state.secondWord, this.WORD_NUMBER)
                        ? false : true;

        return result;
    }

    checkIsWordsInMnemonic() {

        if(!this.checkBothWordsInputed()) { 
            return;
        } 

        if(this.containWord(this.state.mnemonic, this.state.firstWord) && this.containWord(this.state.mnemonic, this.state.secondWord)) {
            this.props.screenProps.redirectToMnemonicConfirmedScreen();
        } else {
            this.props.screenProps.redirectToMnemonicNotConfirmedScreen(this.setNewData.bind(this));
        }
    }

    containWord(array, word) {
        let result = array.indexOf(word) !== -1 ? true : false;

        return result;
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.topContainer } >
                    <View style = { styles.topContentContainer } >
                        <View style = { styles.flexRow }>
                            <TouchableOpacity 
                                onPress = { () => { this.props.screenProps.redirectToMnemonicGenerationScreen(); } }
                                style = { styles.backButtonContainer } >
                                <Image 
                                    source = { require('../../images/MyAccount/BlueBackButton.png') }
                                    style = { styles.icon } />
                            </TouchableOpacity>
                            <View>
                                <Text style = { [styles.titleText, styles.titleMargin] }>Confirm</Text>
                                <Text style = { [styles.titleText, styles.titleMargin] }>secret phrase</Text>
                                <Text style = { [styles.titleText, styles.titleMargin] }>backup</Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            onPress = { () => { this.props.screenProps.redirectToLoginScreen(); } }
                            style = { styles.backButtonContainer } >
                            <Text style = { [styles.skipText, styles.titleMargin] }>Skip</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = { styles.infoContainer }>
                    <Text style = { styles.infoText }>{ mnemonicScreenConstants.mnemonicScreenConfirmationMainText }</Text>
                </View>
                <View style = { styles.wordsMargin }>
                    <TouchableOpacity onPress = { this.showFirstSet.bind(this) }>
                        <View style = { styles.contentContainer }>
                            <View style = { !this.containWord(this.state.firstWord, this.WORD_NUMBER) ? { marginTop: getHeight(-3) } : null }>
                                {
                                    !this.containWord(this.state.firstWord, this.WORD_NUMBER)
                                        ? <Text style = { styles.wordNumberText }>{ this.WORD_NUMBER + this.data.firstWordIndex }</Text>
                                        : null
                                }
                                <Text style = { styles.wordText }>{ this.state.firstWord }</Text>
                            </View>
                            <Image
                                source = { require('../../images/DashboardScreen/BlueVector.png') }
                                style = { styles.expanderIcon } />
                        </View>
                        <View style = { styles.underline }/>
                    </TouchableOpacity>
                    <View style = { styles.secondWordMargin } >
                        <TouchableOpacity onPress = { this.showSecondSet.bind(this) }>
                            <View style = { styles.contentContainer }>
                                <View style = { !this.containWord(this.state.secondWord, this.WORD_NUMBER) ? { marginTop: getHeight(-3) } : null }>
                                    {
                                        !this.containWord(this.state.secondWord, this.WORD_NUMBER) 
                                            ? <Text style = { styles.wordNumberText }>{ this.WORD_NUMBER + this.data.secondWordIndex }</Text>
                                            : null
                                    }
                                    <Text style = { styles.wordText }>{ this.state.secondWord }</Text>
                                </View>
                                <Image
                                    source = { require('../../images/DashboardScreen/BlueVector.png') }
                                    style = { styles.expanderIcon } />
                            </View>
                            <View style = { styles.underline }/>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress = { this.checkIsWordsInMnemonic.bind(this) }>
                    <View style = { 
                            this.checkBothWordsInputed() 
                                ? styles.confirmButton
                                : [ styles.confirmButton, styles.blurredButton ] 
                        } >
                        <Text style = { styles.confirmButtonText }>Confirm</Text>
                    </View>
                </TouchableOpacity>
                {
                    this.state.showFirstSet 
                        ? this.getWordPopUpData({ data: this.data.firstSet, setWord: this.setFirstWord.bind(this) })
                        : null
                }
                {
                    this.state.showSecondSet
                        ? this.getWordPopUpData({ data: this.data.secondSet, setWord: this.setSecondWord.bind(this) })
                        : null
                }
            </View>
        )
    }
}

const WordContainer = (element, index, setWord) => {
    return(
        <View key = { index } style = { styles.contentPadding }>
            <TouchableOpacity 
                onPress = { () => { setWord(element) } }
                style = { styles.popUpItemContainer } >
                <Text style = { styles.wordText }>{ element }</Text>
            </TouchableOpacity>
            <View style = { styles.underline }/>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor: '#FFFFFF',
        paddingHorizontal: getWidth(20)
    },
    topContainer: {
        height: getHeight(150)
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
    titleText: { 
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(30), 
        lineHeight: getHeight(33),
        color: '#384B65' 
    },
    titleMargin: {
        marginLeft: getWidth(20),
    },
    skipText: {
        fontFamily: 'Montserrat-Medium', 
        fontSize: getHeight(18), 
        lineHeight: getHeight(22),
        color: '#2794FF'
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    infoContainer: {
        marginTop: getHeight(10),
        height: getHeight(50)
    },
    infoText: {
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(23),
        color: '#384B65' 
    },
    contentContainer: {
        height: getHeight(55),
        paddingTop: getHeight(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flexRow: {
        flexDirection: 'row'
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    expanderIconContainer: {
        height: getHeight(24),
        width: getWidth(24),
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    expanderIcon: {
        height: getHeight(12),
        width: getWidth(7)
    },
    wordText:{
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        color: '#384B65'
    },
    underline: {
        height: 0.5,
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    },
    popUpContainer: {
        position: 'absolute',
        top: getHeight(240),
        alignSelf: 'center',
        height: getHeight(165),
        width: getWidth(355),
        backgroundColor: '#FFFFFF',
        elevation: 5
    },
    contentPadding: {
        paddingHorizontal: getWidth(20)
    },
    popUpItemContainer: {
        height: getHeight(55),
        justifyContent: 'center'
    },
    wordsMargin: {
        marginTop: getHeight(30)
    },
    secondWordMargin: {
        marginTop: getHeight(20)
    },
    wordNumberText: {
        fontFamily: 'Montserrat-Medium', 
        fontSize: getHeight(12), 
        lineHeight: getHeight(15),
        color: 'rgba(56, 75, 101, 0.4)' 
    },
    confirmButton: {
        marginTop: getHeight(180),
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
    confirmButtonText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: 'white'
    },
    blurredButton: {
        backgroundColor: 'rgba(38, 132, 255, 0.4)', 
        borderColor: '#FFFFFF'
    }
});

MnemonicConfirmationComponent.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object
}