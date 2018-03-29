import BucketsScreenNavigator from '../../navigators/BucketsScreenNavigator';
import checkMultipleNav from '../../utils/navigationUtils';

const initialState = BucketsScreenNavigator.router.getStateForAction(BucketsScreenNavigator.router.getActionForPathAndParams('BucketsListScreen'));

export default function bucketsScreenNavReducer(state = initialState, action) { 
    let nextState = BucketsScreenNavigator.router.getStateForAction(action, state);

    try {
        BucketsScreenNavigator.router.getPathAndParamsForState(nextState);
        nextState = checkMultipleNav(nextState, state);
    } catch(e) {
        console.log(e.message);
        nextState = state;
    }
    

	return nextState || state;
}