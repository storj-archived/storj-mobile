import { TabNavigator } from 'react-navigation';
import TabBarComponent from '../components/TabBarComponent';
import BucketsScreen from '../containers/BucketsContainer';

/**
 * Main Screen Tab Navigator
 */
const MainScreenNavigator = TabNavigator(
    {
        BucketsScreen: {
            screen: BucketsScreen,
            routeName: 'BucketsScreen'
        },
        TestScreen: {
            screen: BucketsScreen,
            routeName: 'TestScreen'
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