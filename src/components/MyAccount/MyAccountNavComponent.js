import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import MyAccountScreenNavigator from '../../navigators/MyAccountScreenNavigator';
import { resetPassword } from '../../reducers/authentification/authActions';

export default class MyAccountNavComponent extends Component {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <MyAccountScreenNavigator
                    screenProps = { { 
                        redirectToInitializationScreen: this.props.redirectToInitializationScreen,
                        showQR: this.props.showQR,
                        showStorageInfo: this.props.showStorageInfo,
                        showCredits: this.props.showCredits,
                        showPopUp: this.props.showPopUp,                         
                        storageAmount: this.props.storageAmount,
                        bandwidthAmount: this.props.bandwidthAmount,
                        getBalance: this.props.getBalance,
                        transactionList: this.props.transactionList,
                        resetPassword: this.props.resetPassword
                    } }
                    animatedScrollValue = { this.animatedScrollValue }  />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});