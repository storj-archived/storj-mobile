import authReducer from './authentification/authReducer';
import navReducer from './navigation/mainNavReducer';
import mainScreenNavReducer from './navigation/mainScreenNavReducer';
import mainReducer from './mainContainer/mainReducer';
import bucketsScreenNavReducer from '../reducers/navigation/bucketsScreenNavReducer';
import { createStore, combineReducers } from 'redux';

/**
 * Declaration of redux store with combining all reducers
 */
export const store = createStore(combineReducers({ authReducer, navReducer, mainScreenNavReducer, mainReducer, bucketsScreenNavReducer }));