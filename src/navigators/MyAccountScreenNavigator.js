import { StackNavigator } from 'react-navigation';
import MyAccountMainPageScreen from '../components/MyAccount/MyAccountMainPageComponent';
import StorageScreen from '../components/MyAccount/StorageComponent';
import BalanceScreen from '../components/MyAccount/BalanceComponent';
import SettingsScreen from '../containers/SettingsContainer';
import ChangePasswordScreen from '../components/MyAccount/ChangePasswordComponent';
import PinCodeGenerationScreen from '../components/MyAccount/PinCodeGenerationComponent';
import MyAccountMnemonicScreen from '../components/MyAccount/MyAccountMnemonicComponent';

const MyAccountScreenNavigator = StackNavigator(
    {
        MyAccountMainPageScreen: {
            screen: MyAccountMainPageScreen,
            routeName: 'MyAccountMainPageScreen'
        },
        StorageScreen: {
            screen: StorageScreen,
            routeName: 'StorageScreen'
        },
        BalanceScreen: {
            screen: BalanceScreen,
            routeName: 'BalanceScreen'
        },
        SettingsScreen: {
            screen : SettingsScreen,
            routeName: 'SettingsScreen'
        },
        ChangePasswordScreen: {
            screen : ChangePasswordScreen,
            routeName: 'ChangePasswordScreen'
        },
        PinCodeGenerationScreen: {
            screen: PinCodeGenerationScreen,
            routeName: 'PinCodeGenerationScreen'
        },
        MyAccountMnemonicScreen: {
            screen: MyAccountMnemonicScreen,
            routeName: 'MyAccountMnemonicScreen'
        }
    }, 
    {
        initialRouteName: 'MyAccountMainPageScreen',
        headerMode : 'none',
        navigationOptions: {
            header:null,
            gesturesEnabled: false
        }
    }
);

export default MyAccountScreenNavigator;