import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import MyAccountNavContainer from '../../containers/MyAccountNavContainer';
import { resetPassword } from '../../reducers/authentification/authActions';
import PropTypes from 'prop-types';

export default class MyAccountNavComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <MyAccountNavContainer
                    redirectToInitializationScreen = { this.props.redirectToInitializationScreen }
                    showSyncWindow = { this.props.showSyncWindow }
                    showQR = { this.props.showQR }
                    showStorageInfo = { this.props.showStorageInfo }
                    showCredits = { this.props.showCredits }                      
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

MyAccountNavComponent.propTypes = {
    bandwidthAmount: PropTypes.string,
    getBalance: PropTypes.func,
    redirectToInitializationScreen: PropTypes.func,
    resetPassword: PropTypes.func,
    showCredits: PropTypes.func,
    showQR: PropTypes.func,
    showStorageInfo: PropTypes.func,
    storageAmount: PropTypes.string,
    transactionList: PropTypes.array
}