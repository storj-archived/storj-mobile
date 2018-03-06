import { StackNavigator } from 'react-navigation';
import MyAccountMainPageScreen from '../components/MyAccount/MyAccountMainPageComponent';

const MyAccountScreenNavigator = StackNavigator(
    {
        MyAccountMainPageScreen: {
            screen: MyAccountMainPageScreen,
            routeName: 'MyAccountMainPageScreen'
        }
    }, 
    {
        initialRouteName: 'MyAccountMainPageScreen',
        headerMode : 'none'
    }
);

export default MyAccountScreenNavigator;