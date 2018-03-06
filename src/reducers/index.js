import authReducer from './authentification/authReducer';
import navReducer from './navigation/mainNavReducer';
import mainScreenNavReducer from './navigation/mainScreenNavReducer';
import mainReducer from './mainContainer/mainReducer';
import favouritesReducer from './mainContainer/Favourites/favouritesReducer';
import bucketsScreenNavReducer from '../reducers/navigation/bucketsScreenNavReducer';
import dashboardScreenNavReducer from '../reducers/navigation/dashboardScreenNavReducer';
import myAccountScreenNavReducer from '../reducers/navigation/myAccountScreenNavReducer';
import filesReducer from '../reducers/mainContainer/Files/filesReducer';
import { createStore, combineReducers } from 'redux';

/**
 * Declaration of redux store with combining all reducers
 */
const reducers = {
    authReducer, 
    navReducer, 
    mainScreenNavReducer, 
    mainReducer, 
    bucketsScreenNavReducer,
    dashboardScreenNavReducer,
    myAccountScreenNavReducer,
    favouritesReducer,
    filesReducer
};

export const store = createStore(combineReducers({ ...reducers }));