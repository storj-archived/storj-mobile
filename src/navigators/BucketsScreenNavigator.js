import { StackNavigator } from 'react-navigation';
import BucketsScreen from '../containers/BucketsListContainer';
import TestScreen from '../containers/FilesListContainer';


const BucketsScreenNavigator = StackNavigator({
    BucketsScreen: {
        screen: BucketsScreen,
        routeName: 'BucketsScreen'
    },
    FilesScreen: {
        screen: TestScreen,
        routeName: 'FilesScreen'
    }
}, {
    initialRouteName: 'BucketsScreen'
});

export default BucketsScreenNavigator;