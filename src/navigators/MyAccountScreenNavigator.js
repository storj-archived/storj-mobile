import { StackNavigator } from 'react-navigation';
import MyAccountMainPageScreen from '../components/MyAccount/MyAccountMainPageComponent';
import StorageScreen from '../components/MyAccount/StorageComponent';
import BalanceScreen from '../components/MyAccount/BalanceComponent';

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
        }
    }, 
    {
        initialRouteName: 'MyAccountMainPageScreen',
        headerMode : 'none'
    }
);

export default MyAccountScreenNavigator;