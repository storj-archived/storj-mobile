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
        FavoriteBucketsScreen: {
            screen: FavoritesItemsScreen,
            routeName: 'FavoritesBucketsScreen'
        },
        FavoriteFilesScreen: {
            screen: FavoritesItemsScreen,
            routeName: 'FavoritesFilesScreen'
        }
    }, 
    {
        initialRouteName: 'DashboardDefaultScreen',
        headerMode : 'none',
        navigationOptions: {
            header:null,
            gesturesEnabled: false
        }

    }
);

export default DashboardScreenNavigator;