import { StackNavigator } from 'react-navigation';
import BucketsScreen from '../containers/BucketsListContainer';
import FilesScreen from '../containers/FilesListContainer';
import DashboardScreen from '../containers/DashboardContainer';

const DashboardScreenNavigator = StackNavigator(
    {
        DashboardScreen: {
            screen: DashboardScreen,
            routeName: 'DashboardScreen'
        },
        BucketsScreen: {
            screen: BucketsScreen,
            routeName: 'BucketsScreen'
        },
        FilesScreen: {
            screen: FilesScreen,
            routeName: 'FilesScreen'
        }
    }, 
    {
        initialRouteName: 'DashboardScreen',
        headerMode : 'none'
    }
);

export default DashboardScreenNavigator;