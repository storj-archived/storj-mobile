import {
    View,
    Text,
    Image,
    Button,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import infoScreensConstants from '../utils/constants/infoScreensConstants';
import { getWidth, getHeight, getDeviceWidth, getDeviceHeight } from '../utils/adaptive';
import { NavigationActions } from 'react-navigation';

/**
* RegisterSuccess component
*/
export default class RegisterSuccessComponent extends Component {
    constructor(props) {
        super(props);

        this.timer = null;
    }

    componentDidMount() {
        this.timer = setTimeout(() => { 
            const action = NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'LoginScreen'})
                ]
            });
            
            this.props.navigation.dispatch(action); 
        }, 2000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return(
            <View style = { styles.screen }>
                <View style = { styles.backgoundWrapper }>
                    <Image 
                        style = { styles.backgroundImage } 
                        source = { require('../images/RegisterInfoScreens/RegisterSuccessBackground.png') } />
                </View>
                <View style = { styles.titleBoldContainer }>
                    <Text style = { styles.titleBold }>{ infoScreensConstants.registerSuccessMainText }</Text>
                </View>
                <View style = { styles.titleLightContainer }>
                    <Text style = { styles.titleLight }>{ infoScreensConstants.registerSuccessAdditionalText }</Text>
                </View>
            </View>
        );
    }   
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    backgroundImage: {
        top: 0,
        right: 0,
        width: getDeviceWidth(),
        height: getDeviceHeight()
    },
    backgoundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute'
    },
    titleBoldContainer: {
        width: getWidth(320),
        height: getHeight(42),
        marginTop: getHeight(413),
        marginLeft: getWidth(31)
    },
    titleBold: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: getHeight(46),
        color: '#2782ff'
    },
    titleLightContainer: {
        width: getWidth(280),
        height: getHeight(120),
        marginTop: getHeight(20),
        marginLeft: getWidth(31)
    },
    titleLight: {
        fontFamily: 'Montserrat',
        fontSize: getHeight(16),
        color: '#384b65'
    }
});