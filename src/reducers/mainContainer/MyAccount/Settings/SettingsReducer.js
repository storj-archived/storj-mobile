import { SETTINGS_ACTIONS } from "../../../../utils/constants/actionConstants";

const {
    LIST_SETTINGS,
    SYNC_ON,
    SYNC_OFF,
    PHOTOS_SYNC,
    MOVIES_SYNC,
    DOCUMENTS_SYNC,
    DOWNLOADS_SYNC
} = SETTINGS_ACTIONS;

const initialState = { 
    syncStatus: false, 
    onWifi: false, 
    onCharging: false, 
    syncPhotos: false, 
    syncMovies: false,
    syncDocuments: false,
    syncDownloads: false    
};

export default function settingsReducer(state = initialState, action) {
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
        case DOWNLOADS_SYNC:
            return {
                ...state,
                syncDownloads: action.payload.value
            };
        default:
            return state || initialState;
    }
}

