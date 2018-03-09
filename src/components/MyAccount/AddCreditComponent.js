import {
    View,
    Text,
    StyleSheet,
    Image,
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
            showDetailedInfo: false,
            showCredits: ''
        }
    }

    showCredits(name) {
        this.setState({showCredits: name, showDetailedInfo: true });
    }

    showDetailedInfo() {
        switch(this.state.showCredits) {
            case 'BTC':
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
                            <View style = { styles.thirdTextBlockMargin }>
                                <Text style = { styles.boldTitle }>BTC</Text>
                                <Text style = { styles.infoText }>{ 'BTC WALLET' }</Text>
                                <View style = { styles.fourthTextBlockMargin }>
                                    <QRCode
                                        value = { 'BTC WALLET' }
                                        size = { 150 }
                                        bgColor = { 'black' }
                                        fgColor = { 'white' } />
                                </View>
                                <View style = { styles.fifthTextBlockMargin }>
                                    <Text style = { styles.infoAdditionalText }>{ myAccountConstants.storjCredentials[3] }</Text>
                                </View>
                            </View>
                        </View>
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
                )
            case 'Storj':
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
                            <View style = { styles.thirdTextBlockMargin }>
                                <Text style = { styles.boldTitle }>STORJ</Text>
                                <Text style = { styles.infoText }>{ myAccountConstants.storjCredentials[2] }</Text>
                                <View style = { styles.fourthTextBlockMargin }>
                                    <QRCode
                                        value = { myAccountConstants.storjCredentials[2] }
                                        size = { 150 }
                                        bgColor = { 'black' }
                                        fgColor = { 'white' } />
                                </View>
                                <View style = { styles.fifthTextBlockMargin }>
                                    <Text style = { styles.infoAdditionalText }>{ myAccountConstants.storjCredentials[3] }</Text>
                                </View>
                            </View>
                        </View>
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
                ) 
        }
    }

    render() {
        return(
            <View style = { [ styles.backgroundWrapper ] }>  
                <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { this.props.showCredits } />
                    {
                        !this.state.showDetailedInfo ?
                            <View style = { styles.mainContainer } >
                                <TouchableOpacity style = { styles.optionContainer } onPress = { () => { this.showCredits('Storj') } } >
                                    <Image style = { styles.icon } source = { require('../../images/MyAccount/Storj.png') } resizeMode = 'contain' />
                                    <View style = { styles.titleMargin }>
                                        <Text style = { styles.titleText }>Add credits with Storj</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style = { styles.optionContainer } onPress = { () => { this.showCredits('BTC') } } >
                                    <Image style = { styles.icon } source = { require('../../images/MyAccount/BTC.png') } resizeMode = 'contain' />
                                    <View style = { styles.titleMargin }>
                                        <Text style = { styles.titleText }>Add credits with Btc</Text>
                                    </View>
                                </TouchableOpacity>
                            </View> : this.showDetailedInfo()
                    }
            </View>
        )
    }
}

AddCreditComponent.propTypes = {
    showCredits: PropTypes.func,
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
        fontFamily: 'Montserrat-Regular', 
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
        height: getHeight(520),
        alignSelf: 'center'
    },
    infoText: {
        fontFamily: 'Montserrat-Regular', 
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
    underline: {
        marginTop: getHeight(25),
        height: 0.5,
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    },
    boldTitle: {
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(16),
        lineHeight: getHeight(20),
        color: '#384B65'
    },
    infoAdditionalText: {
        fontFamily: 'Montserrat-Regular', 
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
});