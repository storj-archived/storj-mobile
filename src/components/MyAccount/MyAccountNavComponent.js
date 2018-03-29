import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import MyAccountNavContainer from '../../containers/MyAccountNavContainer';
import { resetPassword } from '../../reducers/authentification/authActions';

export default class MyAccountNavComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <MyAccountNavContainer
                    redirectToInitializationScreen = { this.props.redirectToInitializationScreen }
                    showQR = { this.props.showQR }
                    showStorageInfo = { this.props.showStorageInfo }
                    showCredits = { this.props.showCredits }
                    showPopUp = { this.props.showPopUp }                         
                    storageAmount = { this.props.storageAmount }
                    bandwidthAmount = { this.props.bandwidthAmount }
                    getBalance = { this.props.getBalance }
                    transactionList = { this.props.transactionList }
                    resetPassword = { this.props.resetPassword } />
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