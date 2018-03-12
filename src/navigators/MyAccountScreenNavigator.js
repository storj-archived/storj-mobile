import { StackNavigator } from 'react-navigation';
import MyAccountMainPageScreen from '../components/MyAccount/MyAccountMainPageComponent';
import StorageScreen from '../components/MyAccount/StorageComponent';
import BalanceScreen from '../components/MyAccount/BalanceComponent';
import SettingsScreen from '../components/MyAccount/SettingsComponent';
import ChangePasswordScreen from '../components/MyAccount/ChangePasswordComponent';

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
        }
    }, 
    {
        initialRouteName: 'MyAccountMainPageScreen',
        headerMode : 'none'
    }
);

export default MyAccountScreenNavigator;