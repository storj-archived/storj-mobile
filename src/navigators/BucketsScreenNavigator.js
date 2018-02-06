import { StackNavigator } from 'react-navigation';
import BucketsScreen from '../containers/BucketsListContainer';
import TestScreen from '../components/TestScreen';


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