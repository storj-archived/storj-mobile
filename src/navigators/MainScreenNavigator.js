import { TabNavigator } from 'react-navigation';
import TabBarComponent from '../components/TabBarComponent';
import BucketsScreen from '../components/BucketsComponent';

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
        tabBarComponent: TabBarComponent 
    }
);

export default MainScreenNavigator;