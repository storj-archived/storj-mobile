import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import React from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';
import OptionsComponent from './OptionsComponent';
import StorjModule from '../../utils/storjModule';
import PropTypes from 'prop-types';
import { InfoButtonComponent } from '../Common/InfoButtonComponent';

export default MyAccountMainPageComponent = (props) => {

    logOut = () => {
        StorjModule.deleteKeys().then(() => {
            props.screenProps.clearAuthReducer();
            props.screenProps.redirectToInitializationScreen();
        }, (e) => {
            console.log(e);
        });
    }
       
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
                        onPress = { props.screenProps.showQR } > 
                        <Text style = { styles.generateQRText } >Generate QR</Text>
                    </TouchableOpacity>
                </View>
                <View style = { styles.topButtonsContainer }>
                    <InfoButtonComponent 
                        imagePath = { require('../../images/DashboardScreen/Storage.png') }
                        title = { 'Storage' }
                        amount = { props.screenProps.storageAmount } />
                    <InfoButtonComponent 
                        imagePath = { require('../../images/DashboardScreen/Bandwidth.png') }
                        title = { 'Bandwidth' }
                        amount = { props.screenProps.bandwidthAmount } />
                </View>
                <TouchableOpacity onPress = { props.screenProps.redirectToBalanceScreen } >
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
                                    { props.screenProps.getBalance() }
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
                        <OptionsComponent 
                            title = { 'Secret phrase' }
                            imageSource = { require('../../images/MyAccount/SecretPhrase.png') }
                            onPress = { props.screenProps.redirectToMyAccountMnemonicScreen } />
                        <View style = { styles.underline } />
                        <OptionsComponent 
                            title = { 'Settings' }
                            imageSource = { require('../../images/MyAccount/Settings.png') }
                            onPress = { props.screenProps.redirectToSettingsScreen } />
                        <View style = { styles.underline } />
                        <OptionsComponent 
                            title = { 'Help' }
                            imageSource = { require('../../images/MyAccount/Help.png') }
                            onPress = { props.screenProps.redirectToHelpPage } />
                        <View style = { styles.underline } />
                        <OptionsComponent 
                            title = { 'Show synchronization queue' }
                            imageSource = { require('../../images/MyAccount/Info.png') }
                            onPress = { props.screenProps.showSyncWindow } />
                    </View>
                    <TouchableOpacity onPress = { logOut }>
                        <View style = { styles.logOutButton }>
                            <Text style = { styles.logOutText }>Log out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
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
        fontFamily: 'montserrat_regular', 
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
        fontFamily: 'montserrat_bold', 
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
        fontFamily: 'montserrat_bold', 
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
        fontFamily: 'montserrat_semibold', 
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
        marginTop: getHeight(65),
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
        fontFamily: 'montserrat_semibold', 
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