import { StackNavigator } from 'react-navigation';
import FilesScreen from '../containers/Dashboard/DashboardFilesListContainer';
import DashboardScreen from '../containers/Dashboard/DashboardContainer';
import FavoriteFilesScreen from '../containers/Files/FavoriteFilesContainer';
import FavoriteBucketsScreen from "../containers/Buckets/FavoriteBucketsContainer";
import RecentSyncFilesScreen from "../containers/Files/RecentSyncFilesContainer";

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
            screen: FavoriteBucketsScreen,
            routeName: 'FavoritesBucketsScreen'
        },
        FavoriteFilesScreen: {
            screen: FavoriteFilesScreen,
            routeName: 'FavoritesFilesScreen'
        },
        RecentSyncFilesScreen: {
            screen: RecentSyncFilesScreen,
            routeName: 'RecentSyncFilesScreen'
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