import authReducer from './authentification/authReducer';
import navReducer from './navigation/mainNavReducer';
import mainScreenNavReducer from './navigation/mainScreenNavReducer';
import mainReducer from './mainContainer/mainReducer';
import bucketsScreenNavReducer from '../reducers/navigation/bucketsScreenNavReducer';
import dashboardScreenNavReducer from '../reducers/navigation/dashboardScreenNavReducer';
import myAccountScreenNavReducer from '../reducers/navigation/myAccountScreenNavReducer';
import filesReducer from '../reducers/mainContainer/Files/filesReducer';
import bucketReducer from '../reducers/mainContainer/Buckets/bucketReducer';
import billingReducer from '../reducers/billing/billingReducer';
import settingsReducer from "../reducers/mainContainer/MyAccount/Settings/SettingsReducer";
import syncQueueReducer from "../reducers/mainContainer/SyncQueue/syncQueueReducer";
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { ACTIONS } from "../utils/constants/actionConstants"
import thunk from "redux-thunk";

/**
 * Declaration of redux store with combining all reducers
 */
const combinedReducers = combineReducers({
    authReducer, 
    navReducer, 
    mainScreenNavReducer, 
    mainReducer, 
    bucketsScreenNavReducer,
    dashboardScreenNavReducer,
    myAccountScreenNavReducer,
    filesReducer,
    bucketReducer,
    billingReducer,
    settingsReducer,
    syncQueueReducer
});

// Reducer to set global state to all reducers
const rootReducer = (state, action) => {
    if (action.type === ACTIONS.CLEAR) {
        state = undefined;
    }
  
    return combinedReducers(state, action)
}

export const store = createStore(combinedReducers, applyMiddleware(thunk));