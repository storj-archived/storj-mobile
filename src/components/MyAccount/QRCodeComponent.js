import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../../utils/adaptive';
import myAccountConstants from '../../utils/constants/myAccountConstants';
import QRCode from 'react-native-qrcode';

export default QRCodeComponent = (props) => {

    getCredentials = () => {
        return JSON.stringify({email: props.email, password: props.password, mnemonic: props.mnemonic})
    }

    const credentials = getCredentials(); 

    return (
        <View style = { [ styles.backgroundWrapper ] }>  
            <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { props.showQR } />
                <View style = { styles.mainContainer } >
                    <View style = { styles.qrContainer }>
                    {
                        credentials ?
                            <QRCode
                                value = { credentials }
                                size = { getHeight(200) }
                                bgColor = { 'black' }
                                fgColor = { 'white' } /> : null
                    }
                    </View>
                    <View style = { styles.infoTextContainer }>
                        <Text style = { styles.infoText }>{ myAccountConstants.qrCodeInfoText[0] }</Text>
                        <Text style = { styles.infoText }>{ myAccountConstants.qrCodeInfoText[1] }</Text>
                    </View>
                </View>
        </View>
    );
}

QRCodeComponent.propTypes = {
    showQR: PropTypes.func,
    email: PropTypes.string,
    hideActionBar: PropTypes.bool,
    mnemonic: PropTypes.string,
    password: PropTypes.string
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        height: getHeight(377),
        paddingHorizontal: getWidth(10),
        alignSelf: 'center',
        borderRadius: 6,
        marginTop: getHeight(15)
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
    qrContainer: {
        marginTop: getHeight(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: getWidth(208),
        height: getHeight(208),
    },
    infoTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: getWidth(243),
        height: getHeight(37),
        marginTop: getHeight(12)
    },
    infoText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(14), 
        color: '#384B65'
    }
});