import { TabNavigator } from 'react-navigation';
import TabBarComponent from '../components/TabBarComponent';
import BucketsScreen from '../containers/BucketsContainer';
import TestScreen from '../components/TestScreen';

/**
 * Main Screen Tab Navigator
 */
const MainScreenNavigator = TabNavigator(
    {
        TestScreen: {
            screen: TestScreen,
            routeName: 'TestScreen'
        },
        BucketsScreen: {
            screen: BucketsScreen,
            routeName: 'BucketsScreen'
        }
    },
    {
        initialRouteName: 'BucketsScreen',
        tabBarPosition: 'bottom',
        tabBarComponent: TabBarComponent,
        swipeEnabled: false
    }
);

export default MainScreenNavigator;