import MyAccountScreenNavigator from '../../navigators/MyAccountScreenNavigator';

const initialState = MyAccountScreenNavigator.router.getStateForAction(MyAccountScreenNavigator.router.getActionForPathAndParams('MyAccountMainPageScreen'));

export default function bucketsScreenNavReducer(state = initialState, action) { 
    let nextState = MyAccountScreenNavigator.router.getStateForAction(action, state);

    try {
        MyAccountScreenNavigator.router.getPathAndParamsForState(nextState);
    } catch(e) {
        console.log(e.message);
        nextState = state;
    }
    
	return nextState || state;
}