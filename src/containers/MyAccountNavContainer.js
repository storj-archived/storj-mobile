import {
    View,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addNavigationHelpers } from 'react-navigation';
import React, { Component } from 'react';
import MyAccountScreenNavigator from '../navigators/MyAccountScreenNavigator';
import { myAccountNavigationActions } from '../reducers/navigation/navigationActions';

class MyAccountNavContainer extends Component {
    constructor(props) {
        super(props);
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
                        resetPassword: this.props.resetPassword,
                        redirectToBalanceScreen: this.props.redirectToBalanceScreen,
                        redirectToChangePasswordScreen: this.props.redirectToChangePasswordScreen,
                        redirectToPinCodeGenerationScreen: this.props.redirectToPinCodeGenerationScreen,
                        redirectToSettingsScreen: this.props.redirectToSettingsScreen, 
                        redirectToStorageScreen: this.props.redirectToStorageScreen, 
                        redirectToMyAccountScreen: this.props.redirectToMyAccountScreen
                    } }
                    navigation = { addNavigationHelpers({ 
                        dispatch: this.props.dispatch,
                        state: this.props.nav
                    })} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        nav: state.myAccountScreenNavReducer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators( { 
            ...myAccountNavigationActions
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountNavContainer);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});