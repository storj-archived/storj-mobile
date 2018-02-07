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
import mnemonicScreenConstants from '../utils/constants/mnemonicScreenConstants';
import { getWidth, getHeight, getDeviceWidth, getDeviceHeight } from '../utils/adaptive';
import { getEmail, getMnemonic, removeMnemonicNotSaved } from '../utils/AsyncStorageModule';

/**
* MnemonicGeneration component
*/
export default class MnemonicGenerationComponent extends Component {
    constructor(props) {
        super(props);

        /**
         * Local state for changing rendered view
         */
        this.state = {
            mnemonic: null,
            email: null,
            isLoading: false,
            showMnemonic: false,
            showModal: false,
            isMnemonicCopied: false,
            showConfirmation: false
        }
    }

    async componentDidMount() {
        this.setState({ isLoading: true });

        this.setState({ 
            mnemonic: await getMnemonic(), 
            email: await getEmail()
        });

        this.setState({ isLoading: false });
    }

    /**
     * Changing state to show saving options
     */
    showModal() {
        this.setState({ showModal: true });
    }

    /**
     * Changing state to show additional confirmation 
     */
    showConfirmation() {
        this.setState({ showConfirmation: true });
    }

    /**
     * Changing state to show generated mnemonic
     */
    showMnemonic() {
        this.setState({ showMnemonic: true });
    }

    /**
     * Saving mnemonic by saving to Clipboard
     */
    onCopyToClipboard() {
        Clipboard.setString( this.state.mnemonic );
        this.setState({ showModal: false, isMnemonicCopied: true });
    }

    /**
     * Saving mnemonic by sending via email
     */
    async onSendViaEmail() {
        await this.preparingEmailSending();
        this.setState({ showModal: false, isMnemonicCopied: true });
    }

    /**
     * Saving mnemonic by saving as file
     */
    onSaveAsFile() {
        this.setState({ showModal: false, isMnemonicCopied: true });
    }

    /**
     * Hiding saving option view
     */
    onCancel() {
        this.setState({ showModal: false, isMnemonicCopied: false });
    }

    /**
     * Navigation to login screen
     */
    async redirectToLoginScreen() {
        await removeMnemonicNotSaved();
        this.props.navigation.navigate('LoginScreen');
    }

    /**
     * Changing state to return to initial view to try saving mnemonic again
     */
    cancelConfirmation() {
        this.setState({ showConfirmation: false, isMnemonicCopied: false });
    }

    /**
     * Creating alert to confirm that mnemonic was saved
     */
    confirmationModalView() {
        Alert.alert(
            'Are you sure that you save your mnemonic?',
            'If no please do it again to not to loose access to your files in future.',
            [
                { text: 'YES', onPress: this.redirectToLoginScreen.bind(this) },
                { text: 'NO', onPress:  this.cancelConfirmation.bind(this) },
            ],
            { cancelable: false }
        );
    }

    /**
     * Forming url and link user to mailbox to send mnemonic to registered address
     */
    preparingEmailSending() {
        const url = 'mailto:' + this.state.email + '?subject=Your Storj mnemonic&body=' + this.state.mnemonic;
        Linking.openURL(url); 
    }
    
    /**
     * Showing saving options and cancel buttons 
     */
    savingOptionView() {
        return(
            <View style = { styles.backgoundWrapper }>
                <View style = { [ styles.backgoundWrapper, styles.dimBlack ] } />
                <View style = { styles.modalContainer }>
                    <TouchableOpacity style = { styles.popUpButtonContainer } onPressOut = { this.onCopyToClipboard.bind(this) } >
                        <Text style = { styles.popUpButtonText }>Copy to Clipboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = { styles.popUpButtonContainer } onPressOut = { this.onSendViaEmail.bind(this) } >
                        <Text style = { styles.popUpButtonText }>Send via Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = { styles.popUpButtonContainer } onPressOut = { this.onSaveAsFile.bind(this) } >
                        <Text style = { styles.popUpButtonText }>Save as File</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = { styles.popUpButtonContainer } onPressOut = { this.onCancel.bind(this) } >
                        <Text style = { styles.popUpButtonCancelText }>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    /**
     * Showing info about mnemonic and get mnemonic button
     */
    showGetMnemonicButton() {
        return(
            <View style = { styles.changingContainer }>
                <View style = { styles.explanationContainer }>
                    <Text style = { styles.explanation }>{ mnemonicScreenConstants.mnemonicScreenExplanationText }</Text>
                </View>
                <TouchableOpacity style = { styles.nextButton } onPressOut = { this.showMnemonic.bind(this) } >
                    <Text style = { styles.nextButtonText }>GET MNEMONIC</Text>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * Showing Continue button when mnemonic was saved
     */
    showContinueButton() {
        return(
            <TouchableOpacity style = { styles.nextButton } onPressOut = { this.showConfirmation.bind(this) } >
                <Text style = { styles.nextButtonText }>CONTINUE</Text>
            </TouchableOpacity>
        );
    }

    /**
     * Showing Copy and save mnemonic button when mnemonic was shown
     */
    showSaveMnemonicButton() {
        return(
            <TouchableOpacity style = { styles.nextButton } onPressOut = { this.showModal.bind(this) } >
                <Text style = { styles.nextButtonText }>COPY AND SAVE MNEMONIC</Text>
            </TouchableOpacity>
        );
    }

    /**
     * Showing generated mnemonic
     */
    showMnemonicVisibleView() {
        return(  
            <View style = { styles.changingContainer }>
                <View style = { styles.mnemonicContainer }>
                    <Text style = { styles.mnemonicPlaceholderText }>Mnemonic</Text>   
                    <View style = { styles.textInputWrapper }>
                        <TextInput style = { styles.mnemonic } editable = { false } 
                                    multiline = { true } 
                                    value = { this.state.mnemonic } 
                                    placeholderTextColor = 'grey'/>
                    </View>
                </View>
                { !this.state.isMnemonicCopied ? this.showSaveMnemonicButton() : this.showContinueButton() }
            </View>
        );       
    }

    render() { 
        return(
            <View style = { styles.screen }>
                <Image 
                    style = { styles.logo } 
                    source = { require('../images/GetMnemonicScreen/getMnemonicLogo.png') } 
                    resizeMode = 'contain' />
                <View style = { styles.informationLinkContainer }>
                    <Text style = { styles.infoText }>What is Mnemonic?</Text>
                    <Image style = { styles.infoIcon } source = { require('../images/Icons/Info.png') }/>
                </View>
                <View style = { styles.titleBoldContainer }>
                    <Text style = { styles.titleBold }>{ mnemonicScreenConstants.mnemonicScreenMainText }</Text>
                </View>
                <View style = { styles.titleLightContainer }>
                    <Text style = { styles.titleBold }>{ mnemonicScreenConstants.mnemonicScreenAdditionalText }</Text>
                </View>
                { this.state.showMnemonic && !this.state.isLoading ? this.showMnemonicVisibleView() : this.showGetMnemonicButton() } 
                { this.state.showModal ? this.savingOptionView() : null }
                { this.state.showConfirmation ? this.confirmationModalView() : null }
            </View>
        );
    }   
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    logo: {
        position: 'absolute',
        height: getHeight(250),
        width: getWidth(250),
        top: getHeight(103),
        left: getWidth(-40)
    },
    informationLinkContainer: {
        position: 'absolute',
        height: getHeight(24),
        width: getWidth(140),
        top: getHeight(20),
        right: getWidth(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoText: {
        fontFamily: 'Montserrat',
        fontSize: getHeight(14),
        lineHeight: getHeight(24),
        color: '#2782ff',
        marginBottom: getHeight(5)
    },
    infoIcon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    titleBoldContainer: {
        width: getWidth(175),
        height: getHeight(42),
        marginTop: getHeight(290),
        marginLeft: getWidth(16)
    },
    titleBold: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: getHeight(46),
        color: '#2782ff'
    },
    titleLightContainer: {
        width: getWidth(320),
        height: getHeight(42),
        marginTop: getHeight(8),
        marginLeft: getWidth(16)
    },
    explanationContainer: {
        width: getWidth(320),
        alignSelf: 'flex-start',
        height: getHeight(164),
        marginTop: getHeight(10)
    },
    explanation: {
        fontFamily: 'Montserrat',
        fontSize: getHeight(16),
        color: '#384b65'
    },
    mnemonicContainer: {
        marginTop: getHeight(10),
        alignSelf: 'flex-start',
        height: getHeight(164),
        width: getWidth(300)
    },
    mnemonic: {
        fontFamily: 'Montserrat',
        fontSize: getHeight(16),
        color: '#1c1b1b'
    },
    mnemonicPlaceholderText: {
        fontSize: getHeight(12),
        color: '#8c92ac',
        fontFamily: 'Montserrat'
    },
    changingContainer: {
        marginTop: getHeight(10),
        marginLeft: getWidth(16),
        alignItems: 'center',
        justifyContent: 'center',
        width: getWidth(350)
    },
    nextButton: {
        marginTop: getHeight(24),
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
    },
    backgoundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.3
    },
    modalContainer: {
        position: 'absolute',
        bottom: getHeight(20), 
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
    popUpButtonContainer: {
        marginTop: getHeight(8),
        alignSelf: 'center',
        width: getWidth(359),
        height: getHeight(43),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: getWidth(4)
    },
    popUpButtonText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(18),
        color: '#2782ff'
    },
    popUpButtonCancelText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(18),
        color: '#8c92ac'
    },
    confirmationTextContainer: {
        marginTop: getHeight(8),
        alignSelf: 'center',
        width: getWidth(359),
        height: getHeight(250),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: getWidth(8)
    },
    confirmationMainText: {
        fontFamily: 'Montserrat',
        fontSize: getHeight(20),
        color: '#2782ff'
    },
    confirmationAdditionalText: {
        fontFamily: 'Montserrat',
        fontSize: getHeight(15),
        color: '#384b65'
    }
});