import MyAccountScreenNavigator from '../../navigators/MyAccountScreenNavigator';
import checkMultipleNav from '../../utils/navigationUtils';

const initialState = MyAccountScreenNavigator.router.getStateForAction(MyAccountScreenNavigator.router.getActionForPathAndParams('MyAccountMainPageScreen'));

export default function bucketsScreenNavReducer(state = initialState, action) { 
    let nextState = MyAccountScreenNavigator.router.getStateForAction(action, state);

    try {       
        MyAccountScreenNavigator.router.getPathAndParamsForState(nextState);
        nextState = checkMultipleNav(nextState, state);
    } catch(e) {
        console.log(e.message);
        nextState = state;
    }
    
	return nextState || state;
}