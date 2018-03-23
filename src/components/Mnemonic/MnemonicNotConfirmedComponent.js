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

export default class MnemonicNotConfirmedComponent extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.contentContainer }>
                    <View style = { styles.titleContainer } >
                        <Text style = { styles.titleText } >Secret phrase backup failed</Text>
                    </View>
                    <View style = { styles.errorImageContainer }>
                        <Image
                            source = { require('../../images/RegisterInfoScreens/Error.png') }
                            style = { styles.errorImage }
                            resizeMode = 'contain' />
                    </View>
                    <TouchableOpacity onPress = { () => { 
                        this.props.navigation.state.params.setNewData(); 
                        this.props.screenProps.navigateBack(); } }>
                        
                        <View style = { styles.backButton } >
                            <Text style = { styles.backButtonText }>Back</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = { () => { this.props.screenProps.redirectToLoginScreen(); } } >
                        <View style = { styles.nextButton }>
                            <Text style = { styles.nextButtonText }>Skip</Text>
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
        flexDirection: 'row' 
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
    errorImage: {
        height: getHeight(250),
        width: getWidth(375)
    },
    errorImageContainer: {
        height: getHeight(250),
        marginTop: getHeight(75),
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
    backButton: {
        marginTop: getHeight(60),
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
    backButtonText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(14),
        color: 'white'
    },
    nextButton: { 
        marginTop: getHeight(20),
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
});