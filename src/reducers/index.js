import authReducer from './authentification/authReducer';
import navReducer from './navigation/mainNavReducer';
import { createStore, combineReducers } from 'redux';

/**
 * Declaration of redux store with combining all reducers
 */
export const store = createStore(combineReducers({ authReducer, navReducer }));