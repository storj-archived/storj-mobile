import DashboardScreenNavigator from '../../navigators/DashboardScreenNavigator';

const initialState = DashboardScreenNavigator.router.getStateForAction(DashboardScreenNavigator.router.getActionForPathAndParams('DashboardDefaultScreen'));

export default function bucketsScreenNavReducer(state = initialState, action) { 

    let nextState = DashboardScreenNavigator.router.getStateForAction(action, state);
    
    try {
        let length = nextState.routes.length;
        if(length > 2 && nextState.routes[length-1].routeName === nextState.routes[length-2].routeName) 
        {
            nextState = state;
        }

        DashboardScreenNavigator.router.getPathAndParamsForState(nextState);
    } catch(e) {
        console.log(e.message);
        nextState = state;
    }
    
	return nextState || state;
}