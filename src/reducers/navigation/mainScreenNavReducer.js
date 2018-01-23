import MainScreenNavigators from '../../navigators/MainScreenNavigator';

/**
 * Declaring initial route of program
 */
export const initialState = MainScreenNavigators.router.getStateForAction(MainScreenNavigators.router.getActionForPathAndParams('BucketsScreen'));

/**
 * Creating navigation reducer
 * @param state passing current state  
 * @param action incoming action to change state
 * @returns new state 
 */
export default function navReducer (state = initialState, action) {
	const nextState = MainScreenNavigators.router.getStateForAction(action, state);

	return nextState || state;
};
