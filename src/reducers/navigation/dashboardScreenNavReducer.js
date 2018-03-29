import DashboardScreenNavigator from '../../navigators/DashboardScreenNavigator';
import checkMultipleNav from '../../utils/navigationUtils';

const initialState = DashboardScreenNavigator.router.getStateForAction(DashboardScreenNavigator.router.getActionForPathAndParams('DashboardDefaultScreen'));

export default function dashboardScreenNavReducer(state = initialState, action) { 

    let nextState = DashboardScreenNavigator.router.getStateForAction(action, state);

    try {
        DashboardScreenNavigator.router.getPathAndParamsForState(nextState);
        nextState = checkMultipleNav(nextState, state);
    } catch(e) {
        console.log(e.message);
        nextState = state;
    }
    
	return nextState || state;
}