import { TabNavigator } from 'react-navigation';
import TabBarComponent from '../components/TabBarComponent';
import BucketsScreen from '../containers/Buckets/BucketsContainer';
import MyPhotosScreen from '../containers/Buckets/MyPhotosContainer';
import DashboardScreen from '../containers/Dashboard/DashboardScreenContainer';
import MyAccountScreen from '../containers/MyAccount/MyAccountContainer';

/**
 * Main Screen Tab Navigator
 */
const MainScreenNavigator = TabNavigator(
    {
        DashboardScreen: {
            screen: DashboardScreen,
            routeName: 'DashboardScreen'
        },
        BucketsScreen: {
            screen: BucketsScreen,
            routeName: 'BucketsScreen'
        },
        MyPhotosScreen: {
            screen: MyPhotosScreen,
            routeName: 'MyPhotosScreen'
        },
        MyAccountScreen: {
            screen: MyAccountScreen,
            routeName: 'MyAccountScreen'
        }
    },
    {
        initialRouteName: 'DashboardScreen',
        tabBarPosition: 'bottom',
        tabBarComponent: TabBarComponent,
        swipeEnabled: false,
        headerMode: 'none'
    }
);

export default MainScreenNavigator;