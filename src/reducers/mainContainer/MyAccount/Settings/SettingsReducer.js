import { SETTINGS_ACTIONS } from "../../../../utils/constants/actionConstants";

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
    syncStatus: false, 
    onWifi: false, 
    onCharging: false, 
    syncPhotos: false, 
    syncMovies: false,
    syncDocuments: false,
    syncMusic: false    
};

export default function settingsReducer(state = initialState, action) {
    console.log(action);
    switch(action.type) {
        case LIST_SETTINGS:
            return {
                ...state,
                ...action.payload.settings
            };
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

