import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';
import OptionsComponent from './OptionsComponent';
import StorjModule from '../../utils/StorjModule';
import PropTypes from 'prop-types';
import { InfoButtonComponent } from '../InfoButtonComponent';

export default class MyAccountMainPageComponent extends Component{
    constructor(props) {
        super(props);     
    }

    logOut() {
        StorjModule.deleteKeys().then(() => {
            this.props.screenProps.clearAuthReducer();
            this.props.screenProps.redirectToInitializationScreen();
        }, (e) => {
            console.log(e);
        });
    }

    render() {        
        return(
            <View style = { styles.mainContainer }>
                <ScrollView 
                    showsVerticalScrollIndicator = { false } 
                    decelerationRate = { 'normal' } 
                    style = { styles.scrollContainer } >
                <View style = { styles.contentContainer }>
                    <View style = { styles.titleContainer }>
                        <Text style = { styles.titleText }>My account</Text>
                        <TouchableOpacity 
                            style = { styles.generateQRButton }
                            onPress = { this.props.screenProps.showQR } > 
                            <Text style = { styles.generateQRText } >Generate QR</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = { styles.topButtonsContainer }>
                        <InfoButtonComponent 
                            imagePath = { require('../../images/DashboardScreen/Storage.png') }
                            title = { 'Storage' }
                            amount = { this.props.screenProps.storageAmount } />
                        <InfoButtonComponent 
                            imagePath = { require('../../images/DashboardScreen/Bandwidth.png') }
                            title = { 'Bandwidth' }
                            amount = { this.props.screenProps.bandwidthAmount } />
                    </View>
                    <TouchableOpacity onPress = { this.props.screenProps.redirectToBalanceScreen } >
                        <View style = { styles.balanceButton }>
                            <View style = { styles.balanceContentContainer }>  
                                <View style = { styles.balanceContent }>
                                    <Image 
                                        style = { styles.buttonImage } 
                                        source = { require('../../images/MyAccount/Wallet.png') } 
                                        resizeMode = 'contain' />
                                    <Text style = { [styles.buttonTextRegular, styles.mainText] }>Balance</Text>
                                </View>
                                <View style = { styles.balanceContent }>
                                    <Text style = { [styles.buttonTextBold, styles.balanceCount] }>
                                        { this.props.screenProps.getBalance() }
                                    </Text>
                                    <Image 
                                        style = { styles.expandImage } 
                                        source = { require('../../images/DashboardScreen/Vector.png') } 
                                        resizeMode = 'contain' />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                        <View style = { styles.optionsMargin } >
                            {
                                <OptionsComponent 
                                    title = { 'Secret phrase' }
                                    imageSource = { require('../../images/MyAccount/SecretPhrase.png') }
                                    onPress = { this.props.screenProps.redirectToMyAccountMnemonicScreen } />
                            }
                            <View style = { styles.underline } />
                            {
                                <OptionsComponent 
                                    title = { 'Settings' }
                                    imageSource = { require('../../images/MyAccount/Settings.png') }
                                    onPress = { this.props.screenProps.redirectToSettingsScreen } />
                            }
                            <View style = { styles.underline } />
                            {
                                <OptionsComponent 
                                    title = { 'Help' }
                                    imageSource = { require('../../images/MyAccount/Help.png') }
                                    onPress = { this.props.screenProps.redirectToHelpPage } />
                            }
                            <View style = { styles.underline } />
                            {
                                <OptionsComponent 
                                    title = { 'About' }
                                    imageSource = { require('../../images/MyAccount/Info.png') }
                                    onPress = { this.props.screenProps.redirectToAboutPage } />
                            }
                            <View style = { styles.underline } />
                            {
                                <OptionsComponent 
                                    title = { 'Show synchronization queue' }
                                    imageSource = { require('../../images/MyAccount/Info.png') }
                                    onPress = { this.props.screenProps.showSyncWindow } />
                            }
                        </View>
                        <TouchableOpacity onPress = { () => { this.logOut(); } }>
                            <View style = { styles.logOutButton }>
                                <Text style = { styles.logOutText }>Log out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    topButtonsContainer: { 
        marginTop: getHeight(15),
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    
    balanceContent: {
        flexDirection: 'row',
        marginTop: getHeight(15)
    },
    
    balanceContentContainer: {
        marginHorizontal: getWidth(15), 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    buttonImage: { 
        height: getHeight(24), 
        width: getWidth(24)
    },
    buttonTextRegular: { 
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        color: '#FFFFFF' 
    },
    mainText: {
        marginLeft: getWidth(10),
        marginTop: getHeight(2)
    },
    balanceCount: {
        marginRight: getWidth(10),
        marginTop: getHeight(2)
    },
    buttonTextBold: { 
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(15), 
        lineHeight: getHeight(20), 
        color: '#FFFFFF' 
    },
    expandImage: { 
        height: getHeight(24), 
        width: getWidth(24)
    },
    titleContainer: { 
        marginTop: getHeight(15),
        height: getHeight(40),  
        justifyContent: 'space-between',
        alignItems: 'center',  
        flexDirection: 'row' 
    },
    titleText: { 
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(30), 
        color: '#384B65' 
    },
    generateQRButton: { 
        width: getWidth(115),
        height: getHeight(30),
        borderRadius: 6,
        borderWidth: getWidth(1.5),
        borderColor: '#2794FF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    generateQRText: { 
        fontFamily: 'Montserrat-SemiBold', 
        fontSize: getHeight(12), 
        color: '#2794FF' 
    },
    balanceButton: {
        height: getHeight(60), 
        marginTop: getHeight(10),
        backgroundColor: '#2794FF', 
        borderRadius: 6, 
        borderWidth: 1, 
        borderColor: '#2794FF'
    },
    optionsMargin: { 
        marginTop: getHeight(20) 
    },
    underline: { 
        height: getHeight(0.5), 
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    },
    logOutButton: { 
        marginTop: getHeight(10),
        marginBottom: getHeight(70),
        width: getWidth(335),
        height: getHeight(50),
        borderRadius: 6,
        borderWidth: getWidth(1.5),
        borderColor: '#EB5757',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logOutText: { 
        fontFamily: 'Montserrat-SemiBold', 
        fontSize: getHeight(16), 
        color: '#EB5757' 
    },
    scrollContainer: {
        paddingBottom: getHeight(50)
    }
});

MyAccountMainPageComponent.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object
}