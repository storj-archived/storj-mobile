import {
    View,
    StyleSheet
} from 'react-native';
import React from 'react';
import MyAccountNavContainer from '../../containers/MyAccountNavContainer';
import PropTypes from 'prop-types';

export default MyAccountNavComponent = (props) => {

    return(
        <View style={ styles.mainContainer }>
            <MyAccountNavContainer
                redirectToInitializationScreen = { props.redirectToInitializationScreen }
                showSyncWindow = { props.showSyncWindow }
                showQR = { props.showQR }
                showStorageInfo = { props.showStorageInfo }
                showCredits = { props.showCredits }                      
                storageAmount = { props.storageAmount }
                bandwidthAmount = { props.bandwidthAmount }
                getBalance = { props.getBalance }
                transactionList = { props.transactionList }
                resetPassword = { props.resetPassword } />
        </View>
    );
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