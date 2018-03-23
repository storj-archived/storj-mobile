import DashboardScreenNavigator from '../../navigators/DashboardScreenNavigator';

const initialState = DashboardScreenNavigator.router.getStateForAction(DashboardScreenNavigator.router.getActionForPathAndParams('DashboardDefaultScreen'));

export default function bucketsScreenNavReducer(state = initialState, action) { 
    let nextState = DashboardScreenNavigator.router.getStateForAction(action, state);

    try {
        DashboardScreenNavigator.router.getPathAndParamsForState(nextState);
    } catch(e) {
        console.log(e.message);
        nextState = state;
    }
    
	return nextState || state;
}