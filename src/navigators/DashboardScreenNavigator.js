import { StackNavigator } from 'react-navigation';
import FilesScreen from '../containers/DashboardFileListContainer';
import DashboardScreen from '../containers/DashboardContainer';
import FavoritesItemsScreen from '../containers/FavoritesItemsContainer';

const DashboardScreenNavigator = StackNavigator(
    {
        DashboardDefaultScreen: {
            screen: DashboardScreen,
            routeName: 'DashboardDefaultScreen'
        },
        DashboardFilesScreen: {
            screen: FilesScreen,
            routeName: 'DashboardFilesScreen'
        },
        FavoritesItemsScreen: {
            screen: FavoritesItemsScreen,
            routeName: 'FavoritesItemsScreen'
        }
    }, 
    {
        initialRouteName: 'DashboardDefaultScreen',
        headerMode : 'none'
    }
);

export default DashboardScreenNavigator;