import StackNavigator from '../../navigators/StackNavigator';

/**
 * Declaring initial route of program
 */
export const initialState = StackNavigator.router.getStateForAction(StackNavigator.router.getActionForPathAndParams('MainScreen'));

/**
 * Creating navigation reducer
 * @param state passing current state  
 * @param action incoming action to change state
 * @returns new state 
 */
export default function navReducer (state = initialState, action) {
	const nextState = StackNavigator.router.getStateForAction(action, state);

	return nextState || state;
};