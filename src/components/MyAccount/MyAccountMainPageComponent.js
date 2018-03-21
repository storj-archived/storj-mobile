import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';
import OptionsComponent from './OptionsComponent';
import StorjModule from '../../utils/StorjModule';

export default class MyAccountMainPageComponent extends Component{
    constructor(props) {
        super(props);     
    }

    async logOut() {
        await StorjModule.deleteKeys();
        this.props.screenProps.redirectToInitializationScreen();
    }

    render() {        
        return(
            <View style = { styles.mainContainer }>
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
                        <TouchableOpacity onPress = { () => { this.props.navigation.navigate('StorageScreen'); } } >
                            <View style = { styles.button }>
                                <View style = { styles.buttonContentContainer }>
                                    <Image 
                                        style = { styles.buttonImage } 
                                        source = { require('../../images/DashboardScreen/Storage.png') } 
                                        resizeMode = 'contain' />
                                    <View >
                                        <Text style = { [styles.buttonTextRegular, styles.topButtonTextMargin] }>Storage</Text>
                                        <Text style = { [styles.buttonTextBold, styles.topButtonTextMargin] }>{ this.props.screenProps.storageAmount }{ ' GB' }</Text>
                                    </View>
                                    <Image 
                                        style = { [ styles.expandImage, styles.topButtonTextMargin ] } 
                                        source = { require('../../images/DashboardScreen/Vector.png') } 
                                        resizeMode = 'contain' />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress = { () => {} } >
                            <View style = { styles.button }>
                                <View style = { styles.buttonContentContainer }>
                                    <Image 
                                        style = { styles.buttonImage } 
                                        source = { require('../../images/DashboardScreen/Bandwidth.png') } 
                                        resizeMode = 'contain' />
                                    <View >
                                        <Text style = { [styles.buttonTextRegular, styles.bandwidthMargin] }>Bandwidth</Text>
                                        <Text style = { [styles.buttonTextBold, styles.bandwidthMargin] }>{ this.props.screenProps.bandwidthAmount }{ ' GB' }</Text>
                                    </View>
                                    <Image 
                                        style = { styles.expandImage } 
                                        source = { require('../../images/DashboardScreen/Vector.png') } 
                                        resizeMode = 'contain' />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress = { () => { this.props.navigation.navigate('BalanceScreen'); } } >
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
                                    <Text style = { [styles.buttonTextBold, styles.balanceCount] }>{ '$100.50' }</Text>
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
                                title = { 'Trash' }
                                imageSource = { require('../../images/MyAccount/Trash.png') }
                                onPress = { () => {} } />
                        }
                        <View style = { styles.underline } />
                        {
                            <OptionsComponent 
                                title = { 'Settings' }
                                imageSource = { require('../../images/MyAccount/Settings.png') }
                                onPress = { () => { this.props.navigation.navigate('SettingsScreen'); } } />
                        }
                        <View style = { styles.underline } />
                        {
                            <OptionsComponent 
                                title = { 'Help' }
                                imageSource = { require('../../images/MyAccount/Help.png') }
                                onPress = { () => {} } />
                        }
                        <View style = { styles.underline } />
                        {
                            <OptionsComponent 
                                title = { 'About' }
                                imageSource = { require('../../images/MyAccount/Info.png') }
                                onPress = { () => {} } />
                        }
                    </View>
                    <TouchableOpacity onPress = { () => { this.logOut(); } }>
                        <View style = { styles.logOutButton }>
                            <Text style = { styles.logOutText }>Log out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    button: { 
        height: getHeight(70), 
        width: getWidth(163), 
        backgroundColor: '#2794FF', 
        borderRadius: 6, 
        borderWidth: 1, 
        borderColor: '#2794FF' 
    },
    balanceContent: {
        flexDirection: 'row',
        marginTop: getHeight(15)
    },
    buttonContentContainer: { 
        marginTop: getHeight(15), 
        marginHorizontal: getWidth(15), 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
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
    topButtonTextMargin: {
        marginLeft: getWidth(10)
    },
    bandwidthMargin: {
        marginLeft: getWidth(5)
    },
    titleContainer: { 
        marginTop: getHeight(30),
        height: getHeight(70),  
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
        fontSize: getHeight(14), 
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
        marginTop: getHeight(36),
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
    }
});
