import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import mnemonicScreenConstants from '../../utils/constants/mnemonicScreenConstants';
import { getWidth, getHeight } from '../../utils/adaptive';
import PropTypes from 'prop-types';

export default class MnemonicInfoComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showEmailAlert: false,
            showBackupAlert: false
        }
    }

    showEmailAlert() {
        Alert.alert(
            'Confirm your email',
            'Please check your email for verification letter. Otherwise you won’t be able to use your account.',
            [
                { 
                    text: 'OK', 
                    onPress: () => { 
                        this.setState({showEmailAlert: false, showBackupAlert: true}); 
                    } 
                },
            ],
            { cancelable: false }
        );
    }

    showBackupAlert() {
        Alert.alert(
            'Backup your secret phrase',
            'It’s your pass code that will allow you to use the app. Please save it somewhere.',
            [
                { 
                    text: 'Next time', 
                    onPress: () => { 
                        this.setState({showEmailAlert: false, showBackupAlert: false});
                        this.props.screenProps.redirectToLoginScreen(); 
                    }
                },
                { 
                    text: 'Backup', 
                    onPress: () => { 
                        this.setState({showEmailAlert: false, showBackupAlert: false}); 
                        this.props.screenProps.redirectToMnemonicGenerationScreen(); 
                    } 
                }
            ],
            { cancelable: false }
        );
    }
    
    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.contentContainer }>
                    <View style = { styles.titleContainer } >
                        <TouchableOpacity 
                            style = { styles.backButton }
                            onPress = { () => { this.props.screenProps.redirectToRegisterSuccessScreen(); } } >
                            <Image 
                                source = { require('../../images/MyAccount/BlueBackButton.png') }
                                style = { styles.icon }
                                resizeMode = 'contain' />
                        </TouchableOpacity>
                        <Text style = { styles.titleText }>Your secret phrase</Text>
                    </View>
                    <View style = { styles.successImageContainer }>
                        <Image
                            source = { require('../../images/RegisterInfoScreens/LockImage.png') }
                            style = { styles.successImage }
                            resizeMode = 'contain' />
                    </View>
                    <View style = { styles.infoContainer }>
                        <Text style = { styles.infoText } >{ mnemonicScreenConstants.mnemonicScreenExplanationText }</Text>
                    </View>
                    <TouchableOpacity onPress = { () => { this.props.screenProps.redirectToMnemonicGenerationScreen() } }>
                        <View style = { styles.backupButton } >
                            <Text style = { styles.backupButtonText }>Backup</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = { () => { this.setState({showEmailAlert: true}); } } >
                        <View style = { styles.nextButton }>
                            <Text style = { styles.nextButtonText }>Skip</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    this.state.showEmailAlert ? this.showEmailAlert() : null
                }
                {
                    this.state.showBackupAlert ? this.showBackupAlert() : null
                }
            </View>
        );
    }   
}

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#FFFFFF'
    },
    contentContainer: {
        paddingHorizontal: getWidth(20)
    },
    titleContainer: { 
        marginTop: getHeight(30),
        height: getHeight(70),
        flexDirection: 'row' 
    },
    backButton: {
        marginTop: getHeight(6)
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    titleText: { 
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(27), 
        lineHeight: getHeight(33),
        color: '#384B65',
        marginLeft: getWidth(15)
    },
    titleTextContainer: {
        width: getWidth(191)
    },
    nextButton: { 
        marginTop: getHeight(10),
        width: getWidth(335),
        height: getHeight(50),
        borderRadius: 6,
        borderWidth: getWidth(1.5),
        borderColor: '#2794FF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nextButtonText: { 
        fontFamily: 'Montserrat-SemiBold', 
        fontSize: getHeight(16), 
        color: '#2794FF' 
    },
    successImage: {
        height: getHeight(250),
        width: getWidth(375)
    },
    successImageContainer: {
        height: getHeight(250),
        marginTop: getHeight(45),
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoContainer: {
        marginTop: getHeight(45)
    },
    infoText:{
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(23),
        color: '#384B65'
    },
    backupButton: {
        marginTop: getHeight(24),
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
    backupButtonText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: 'white'
    },
});

MnemonicInfoComponent.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object
}