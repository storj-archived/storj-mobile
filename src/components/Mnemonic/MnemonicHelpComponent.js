import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight, getDeviceHeight } from '../../utils/adaptive';
import mnemonicScreenConstants from '../../utils/constants/mnemonicScreenConstants';

export default class MnemonicHelpComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <View style = { styles.contentContainer }>
                    <View>
                        <View style = { [styles.flexRow, styles.titleContainer] }>
                            <TouchableOpacity 
                                onPress = { this.props.screenProps.redirectToLoginScreen }
                                style = { styles.backButtonContainer } >
                                <Image 
                                    source = { require('../../images/MyAccount/BlueBackButton.png') }
                                    style = { styles.icon } />
                            </TouchableOpacity>
                            <View style = { styles.titleMargin } >
                                <Text style = { styles.titleText }>Secret phrase help</Text>
                            </View>
                        </View>
                        <View style = { styles.infoTextContainer }>
                            <Text style = { styles.infoTextBold }>What is it?</Text>
                            <View style = { styles.firstRegularInfoTextMargin }>
                                <Text style = { styles.infoTextRegular } >{mnemonicScreenConstants.mnemonicHelpInfoText1}</Text>
                            </View>
                            <View style = { styles.secondRegularInfoTextMargin }>
                                <Text style = { styles.infoTextRegular } >{mnemonicScreenConstants.mnemonicHelpInfoText2}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style = { styles.additionalInfoTextBoldMargin }>
                            <Text style = { styles.infoTextBold }>Never created one, or can’t find it?</Text>
                        </View>
                        <View style = { styles.additionalInfoTextRegularMargin }>
                            <Text style = { styles.infoTextRegular }>You’ll need to generate a new one below.</Text>
                        </View>
                        <View style = { styles.buttonContainer }>
                            <TouchableOpacity onPressOut = { this.props.screenProps.redirectToMnemonicGenerationScreen }>
                                <Text style = { styles.buttonText }>Generate a new secret phrase</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> 
            </View>
        );
    }
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainer: {
        paddingHorizontal: getWidth(20),
        height: getDeviceHeight() - 50,
        justifyContent: 'space-between'
    },
    titleContainer: {
        marginTop: getHeight(15),
        height: getHeight(75)
    },
    titleText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(28),
        alignSelf:'flex-start',
        color: '#384B65'
    },
    infoTextBold: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(16),
        alignSelf: 'flex-start',
        color: '#384B65'
    },
    infoTextRegular: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        alignSelf:'flex-start',
        color: '#384B65'
    },
    infoTextContainer: {
        marginTop: getHeight(65)
    },
    firstRegularInfoTextMargin: {
        marginTop: getHeight(10)
    },
    secondRegularInfoTextMargin: {
        marginTop: getHeight(20)
    },
    titleMargin: {
        marginLeft: getWidth(10)
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
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    additionalInfoTextRegularMargin: {
        marginBottom: getHeight(24)
    },
    additionalInfoTextBoldMargin: {
        marginBottom: getHeight(11)
    },
    buttonContainer: {
        width: getWidth(335),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2794FF',
        borderRadius: getWidth(6)
    },
    buttonText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(16),
        color: 'white'
    }
});