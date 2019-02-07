import { SETTINGS_ACTIONS } from "../../../../utils/constants/actionConstants";
import moment from 'moment';

const {
    LIST_SETTINGS,
    SYNC_ON,
    SYNC_OFF,
    SET_WIFI_CONSTRAINT,
    SET_CHARGING_CONSTRAINT,
    PHOTOS_SYNC,
    MOVIES_SYNC,
    DOCUMENTS_SYNC,
    MUSIC_SYNC
} = SETTINGS_ACTIONS;

const initialState = { 
    isSyncActive: false,
    lastSync: "",
    settingsId: null,
    syncStatus: false, 
    onWifi: false, 
    onCharging: false, 
    syncPhotos: false, 
    syncMovies: false,
    syncDocuments: false,
    syncMusic: false    
};

export default function settingsReducer(state = initialState, action) {
    

    switch(action.type) {
        case LIST_SETTINGS:
            let newState = {
                ...state,
                ...action.payload.settings
            };

            newState.lastSync = formatLastSync(newState.lastSync, newState.isSyncActive);
            
            return newState;
        case SYNC_ON:
            return {
                ...state,
                syncStatus: true
            };
        case SYNC_OFF:          
            return {
                ...state,
                syncStatus: false
            };
        case SET_WIFI_CONSTRAINT:
            return {
                ...state,
                onWifi: action.payload.value
            };
        case SET_CHARGING_CONSTRAINT:
            return {
                ...state,
                onCharging: action.payload.value
            };
        case PHOTOS_SYNC:
            return {
                ...state,
                syncPhotos: action.payload.value
            };
        case MOVIES_SYNC:
            return {
                ...state,
                syncMovies: action.payload.value
            };
        case DOCUMENTS_SYNC:
            return {
                ...state,
                syncDocuments: action.payload.value
            };
        case MUSIC_SYNC:
            return {
                ...state,
                syncMusic: action.payload.value
            };
        default:
            return state || initialState;
    }
}

formatLastSync = function(lastSync) {
    let result = "";
    let lastSyncString = "Last sync: ";

    if(!lastSync || !moment(lastSync).isValid()) return result;
  
    var diff = moment.duration(moment().diff(moment(lastSync))).asMinutes();

    let diffMins = Math.abs(Math.round(diff));  
    let diffHrs = Math.abs(Math.round(diffMins / 60));
    let diffDays = Math.abs(Math.round(diffHrs / 24));

    if(diffMins <= 1) return lastSyncString + "just now";
    
    if(diffMins > 1 && diffMins < 59) return lastSyncString + diffMins + " minutes ago";

    if(diffMins >= 60 && diffMins < 120) return lastSyncString + "hour ago";

    if(diffDays < 2 && diffHrs > 1)  return lastSyncString + diffHrs + " hours ago";

    if(diffDays > 1) return lastSyncString + diffDays + " days ago";

    return result;
};

