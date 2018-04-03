import MainScreenNavigator from '../../navigators/MainScreenNavigator';
import checkMultipleNav from '../../utils/navigationUtils';

/**
 * Declaring initial route of program
 */
export const initialState = MainScreenNavigator.router.getStateForAction(MainScreenNavigator.router.getActionForPathAndParams('DashboardScreen'));

/**
 * Creating navigation reducer
 * @param state passing current state  
 * @param action incoming action to change state
 * @returns new state 
 */
export default function navReducer (state = initialState, action) {
	let nextState = MainScreenNavigator.router.getStateForAction(action, state);

	try {
		MainScreenNavigator.router.getPathAndParamsForState(nextState);
		nextState = checkMultipleNav(nextState, state);
    } catch(e) {
        nextState = state;
    }

	return nextState || state;
}
