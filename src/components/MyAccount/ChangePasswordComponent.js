import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';
import InputComponent from '../InputComponent';

export default class SettingsComponent extends Component{
    constructor(props) {
        super(props)

    }

    render() {
        return(
            <View style = { styles.mainContainer } >
                <View style = { styles.topContainer } >
                    <View style = { styles.topContentContainer } >
                        <View style = { styles.flexRow }>
                            <TouchableOpacity 
                                onPress = { () => { this.props.navigation.goBack(); } }
                                style = { styles.backButtonContainer } >
                                <Image 
                                    source = { require('../../images/MyAccount/BlueBackButton.png') }
                                    style = { styles.icon } />
                            </TouchableOpacity>
                            <View >
                                <Text style = { [styles.titleText, styles.titleMargin] }>Change</Text>
                                <Text style = { [styles.titleText, styles.titleMargin] }>password</Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            onPress = { () => { this.props.navigation.goBack(); } }
                            style = { styles.backButtonContainer } >
                            <Text style = { [styles.cancelText, styles.titleMargin] }>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <InputComponent 
                        style = { styles.inputHeight }
                        onChangeText = { () => {} } 
                        isPassword = { true } 
                        placeholder = {'Enter your password'}
                        value = { '' }
                        isError = { this.props.isPasswordError }
                        errorMessage = { 'Invalid password' }
                        regularMessage = { 'Current password' } />
                <InputComponent 
                        style = { styles.inputHeight }
                        onChangeText = { () => {} } 
                        isPassword = { true } 
                        placeholder = {'New password'}
                        value = { '' }
                        isError = { false }
                        errorMessage = { 'Invalid password' }
                        regularMessage = { 'New password' } />
                <InputComponent 
                        style = { styles.inputHeight }
                        onChangeText = { () => {} } 
                        isPassword = { true } 
                        placeholder = {'Confirm password'}
                        value = { '' }
                        isError = { false }
                        errorMessage = { 'Password does not match' }
                        regularMessage = { 'Confirm password' } />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor: '#FFFFFF',
        paddingHorizontal: getWidth(20)
    },
    topContainer: {
        height: getHeight(115)
    },
    topContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: getHeight(15)
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
    titleText: { 
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(30), 
        lineHeight: getHeight(33),
        color: '#384B65' 
    },
    titleMargin: {
        marginLeft: getWidth(20),
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    cancelText: {
        fontFamily: 'Montserrat-Medium', 
        fontSize: getHeight(18), 
        lineHeight: getHeight(22),
        color: '#2794FF'
    }
});