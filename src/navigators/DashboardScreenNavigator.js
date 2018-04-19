import { StackNavigator } from 'react-navigation';
import FilesScreen from '../containers/DashboardFilesListContainer';
import DashboardScreen from '../containers/DashboardContainer';
import FavoriteFilesScreen from '../containers/FavoriteFilesContainer';
import FavoriteBucketsScreen from "../containers/FavoriteBucketsContainer";

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