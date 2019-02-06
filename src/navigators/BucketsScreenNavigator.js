import { StackNavigator } from 'react-navigation';
import BucketsScreen from '../containers/Buckets/BucketsListContainer';
import FilesScreen from '../containers/Files/FilesListContainer';


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
        headerMode: 'none',
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    }
);

export default BucketsScreenNavigator;