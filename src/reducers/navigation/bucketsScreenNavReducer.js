import BucketsScreenNavigator from '../../navigators/BucketsScreenNavigator';

const initialState = BucketsScreenNavigator.router.getStateForAction(BucketsScreenNavigator.router.getActionForPathAndParams('BucketsScreen'));

export default function bucketsScreenNavReducer(state = initialState, action) { 
    let nextState = BucketsScreenNavigator.router.getStateForAction(action, state);

    try {
        BucketsScreenNavigator.router.getPathAndParamsForState(nextState);
    } catch(e) {
        console.log(e.message);
        nextState = state;
    }
    

	return nextState || state;
}