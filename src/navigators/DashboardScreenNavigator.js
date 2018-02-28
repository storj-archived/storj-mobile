import { StackNavigator } from 'react-navigation';
import BucketsScreen from '../containers/BucketsListContainer';
import FilesScreen from '../containers/FilesListContainer';
import DashboardScreen from '../containers/DashboardContainer';

const DashboardScreenNavigator = StackNavigator(
    {
        DashboardScreen: {
            screen: DashboardScreen,
            routeName: 'DashboardDefaultScreen'
        },
        FilesScreen: {
            screen: FilesScreen,
            routeName: 'DashboardFilesScreen'
        }
    }, 
    {
        initialRouteName: 'DashboardDefaultScreen',
        headerMode : 'none'
    }
);

export default DashboardScreenNavigator;