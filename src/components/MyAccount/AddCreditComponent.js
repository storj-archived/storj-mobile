import {
    View,
    Text,
    StyleSheet,
    Image,
    Linking,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../../utils/adaptive';
import QRCode from 'react-native-qrcode';
import myAccountConstants from '../../utils/constants/myAccountConstants';

export default class AddCreditComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showBasicWallets: true,
            showStorjCredits: false,
            showBTCCredits: false
        }

        this.showBTCCredits = this.showBTCCredits.bind(this);
        this.showStorjCredits = this.showStorjCredits.bind(this);
        this.createStorjWallet = this.createStorjWallet.bind(this);
    }

    hideBasicWallets(name) {
        switch (name) {
            case 'Storj': { this.setState({ showBasicWallets: false, showStorjCredits: true }); }
            break;
            case 'BTC': { this.setState({ showBasicWallets: false, showBTCCredits: true }); }
            break;
        }
    }

    showBTCCredits() {
        const uri = 'https://bitpay.com/cart?id=6hsfgugpiX46Qm3vjkR16m';
        this.props.showCredits();
        Linking.openURL(uri);
    }

    async createStorjWallet() {
        await this.props.createWallet("STORJ");
        await this.props.getWallets();
    }

    showStorjCredits() {
        if(this.props.wallets === null || this.props.wallets.length === 0) {
            return(
                <View style = { styles.emptyCreditsInfoContainer } >
                    <View style = { styles.infoContainer } >
                        <Text style = { styles.infoText }>
                            { myAccountConstants.storjCredentials[0] }
                        </Text>
                        <View style = { styles.secondTextBlockMargin }>
                            <Text style = { styles.infoText }>
                                { myAccountConstants.storjCredentials[1] }
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress = { this.createStorjWallet }>
                        <View style = { styles.createWalletButton } >
                            <Text style = { styles.createWalletButtonText }>Create Wallet</Text>
                        </View>
                    </TouchableOpacity>
                </View> 
            )
        } else {
            return(
                <View style = { styles.creditsInfoContainer } >
                    <View style = { styles.infoContainer } >
                        <Text style = { styles.infoText }>
                            { myAccountConstants.storjCredentials[0] }
                        </Text>
                        <View style = { styles.secondTextBlockMargin }>
                            <Text style = { styles.infoText }>
                                { myAccountConstants.storjCredentials[1] }
                            </Text>
                        </View>
                        <View style = { styles.underline } />
                        <ScrollView>
                            {
                                this.props.wallets.map(wallet => {
                                    return(
                                        <View style = { styles.thirdTextBlockMargin } key = { wallet.address }>
                                            <Text style = { styles.boldTitle }>{ wallet.token }</Text>
                                            <Text style = { styles.infoText }>{ wallet.address }</Text>
                                            <View style = { styles.fourthTextBlockMargin }>
                                                <QRCode
                                                    value = { wallet.address }
                                                    size = { getHeight(150) }
                                                    bgColor = { 'black' }
                                                    fgColor = { 'white' } />
                                            </View>
                                        </View>
                                    )
                                })
                            }
                            <View style = { styles.fifthTextBlockMargin }>
                                <Text style = { styles.infoAdditionalText }>{ myAccountConstants.storjCredentials[2] }</Text>
                            </View>
                        </ScrollView>
                        <View style = { styles.closeButton }>
                            <TouchableOpacity 
                                onPress = { this.props.showCredits } >
                                    <Image 
                                        style = { styles.icon }
                                        source = { require('../../images/MyAccount/Close.png') }
                                        resizeMode = 'contain' />
                            </TouchableOpacity>
                        </View>
                    </View> 
                </View>
            )
        }   
    }

    render() {
        return(
            <View style = { [ styles.backgroundWrapper ] }>  
                <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { this.props.showCredits } />
                    {
                        this.state.showBasicWallets ?
                            <View style = { styles.mainContainer } >
                                <TouchableOpacity style = { styles.optionContainer } onPress = { () => { this.hideBasicWallets('Storj') } } >
                                    <Image style = { styles.icon } source = { require('../../images/MyAccount/Storj.png') } resizeMode = 'contain' />
                                    <View style = { styles.titleMargin }>
                                        <Text style = { styles.titleText }>Add credits with Storj</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style = { styles.optionContainer } onPress = { () => { this.hideBasicWallets('BTC') } } >
                                    <Image style = { styles.icon } source = { require('../../images/MyAccount/BTC.png') } resizeMode = 'contain' />
                                    <View style = { styles.titleMargin }>
                                        <Text style = { styles.titleText }>Add credits with Btc</Text>
                                    </View>
                                </TouchableOpacity>
                            </View> : null
                    }
                    {
                        this.state.showBTCCredits ? this.showBTCCredits() : null
                    }
                    {
                        this.state.showStorjCredits ? this.showStorjCredits() : null
                    }
            </View>
        )
    }
}

AddCreditComponent.propTypes = {
    showCredits: PropTypes.func,
    wallets: PropTypes.array,
    createWallet: PropTypes.func,
    getWallets: PropTypes.func
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        height: getHeight(110),
        paddingHorizontal: getWidth(10),
        alignSelf: 'center',
        borderRadius: 6,
        marginTop: getHeight(15)
    },
    titleText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16),
        lineHeight: getHeight(23),
        color: '#2794FF'
    },
    titleMargin: {
        marginLeft: getWidth(15)
    },
    infoContainer: {
        paddingHorizontal: getWidth(20),
        paddingTop: getHeight(10),
        alignSelf: 'center'
    },
    infoText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16),
        lineHeight: getHeight(23),
        color: '#384B65'
    },
    closeButton: {
        alignSelf: 'center'
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    backgroundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.2
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: getWidth(20),
        height: getHeight(55),
    },
    creditsInfoContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        height: getHeight(617),
        paddingHorizontal: getWidth(10),
        paddingVertical: getHeight(10), 
        justifyContent: 'space-between',
        marginTop: getHeight(15),
        alignSelf: 'center',
        borderRadius: 6
    },
    emptyCreditsInfoContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        height: getHeight(257),
        paddingHorizontal: getWidth(10),
        paddingTop: getHeight(10), 
        paddingBottom: getHeight(30),  
        justifyContent: 'space-between',
        marginTop: getHeight(15),
        alignSelf: 'center',
        borderRadius: 6
    },
    underline: {
        marginTop: getHeight(25),
        height: 0.5,
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    },
    boldTitle: {
        fontFamily: 'montserrat_bold', 
        fontSize: getHeight(16),
        lineHeight: getHeight(20),
        color: '#384B65'
    },
    infoAdditionalText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(14),
        lineHeight: getHeight(20),
        color: 'rgba(56, 75, 101, 0.4)'
    },
    secondTextBlockMargin: {
        marginTop: getHeight(20)
    },
    thirdTextBlockMargin: {
        marginTop: getHeight(30)
    },
    fourthTextBlockMargin: {
        marginTop: getHeight(15)
    },
    fifthTextBlockMargin: {
        marginTop: getHeight(35)
    },
    createWalletButton: {
        marginTop: getHeight(47),
        alignSelf: 'center',
        width: getWidth(315),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2794FF',
        borderColor: '#2794FF',
        borderRadius: getWidth(6),
        borderWidth: getWidth(1.5)
    },
    createWalletButtonText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(14),
        color: 'white'
    }
});