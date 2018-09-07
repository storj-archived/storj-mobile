import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import infoScreensConstants from '../utils/constants/infoScreensConstants';
import { getWidth, getHeight } from '../utils/adaptive';

/**
* RegisterSuccess component
*/
export default class RegisterSuccessComponent extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.contentContainer }>
                    <View style = { styles.titleContainer }>
                        <View style = { styles.titleTextContainer }>
                            <Text style = { styles.titleText }>Verify your email</Text>
                        </View>
                        <TouchableOpacity 
                            style = { styles.resendEmailButton }
                            onPress = { () => {} } > 
                            <Text style = { styles.resendEmailText } >Re-send email</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = { styles.successImageContainer }>
                        <Image
                            source = { require('../images/RegisterInfoScreens/SuccessImage.png') }
                            style = { styles.successImage }
                            resizeMode = 'contain' />
                    </View>
                    <View style = { styles.infoContainer }>
                        <Text style = { styles.infoText } >{ infoScreensConstants.registerSuccessMainText[0] }</Text>
                        <Text style = { styles.infoText } >{ infoScreensConstants.registerSuccessMainText[1] }</Text>
                    </View>
                    <TouchableOpacity onPress = { this.props.screenProps.redirectToMnemonicInfoScreen }>
                        <View style = { styles.nextButton }>
                            <Text style = { styles.nextButtonText }>Next</Text>
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
    titleContainer: { 
        marginTop: getHeight(30),
        height: getHeight(70),  
        justifyContent: 'space-between',
        flexDirection: 'row' 
    },
    titleText: { 
        fontFamily: 'montserrat_bold', 
        fontSize: getHeight(30), 
        lineHeight: getHeight(33),
        color: '#384B65' 
    },
    titleTextContainer: {
        width: getWidth(191)
    },
    nextButton: { 
        marginTop: getHeight(70),
        width: getWidth(335),
        height: getHeight(50),
        borderRadius: 6,
        borderWidth: getWidth(1.5),
        borderColor: '#2794FF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nextButtonText: { 
        fontFamily: 'montserrat_semibold', 
        fontSize: getHeight(16), 
        color: '#2794FF' 
    },
    resendEmailButton: { 
        width: getWidth(125),
        height: getHeight(30),
        marginTop: getHeight(5),
        borderRadius: 6,
        borderWidth: getWidth(1.5),
        borderColor: '#2794FF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    resendEmailText: { 
        fontFamily: 'montserrat_semibold', 
        fontSize: getHeight(14), 
        lineHeight: getHeight(17),
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
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(23),
        color: '#384B65'
    }
});