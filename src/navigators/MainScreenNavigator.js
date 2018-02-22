import { TabNavigator } from 'react-navigation';
import TabBarComponent from '../components/TabBarComponent';
import BucketsScreen from '../containers/BucketsContainer';
import TestScreen from '../components/EmptyComponent';
import DashboardScreen from '../containers/DashboardScreenContainer';

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
        }
    },
    {
        initialRouteName: 'DashboardScreen',
        tabBarPosition: 'bottom',
        tabBarComponent: TabBarComponent,
        swipeEnabled: false
    }
);

export default MainScreenNavigator;