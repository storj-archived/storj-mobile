import { StackNavigator } from 'react-navigation';
import BucketsScreen from '../containers/BucketsListContainer';
import FilesScreen from '../containers/FilesListContainer';


const BucketsScreenNavigator = StackNavigator(
    {
        BucketsListScreen: {
            screen: BucketsScreen,
            routeName: 'BucketsListScreen'
        },
        FilesScreen: {
            screen: FilesScreen,
            routeName: 'FilesScreen'
        }
    }, 
    {
        initialRouteName: 'BucketsListScreen',
        headerMode: 'none'
    }
);

export default BucketsScreenNavigator;