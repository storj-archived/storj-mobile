import SyncModule from '../../../../utils/SyncModule';
import settingsActions from './SettingsActions';

export function listSettingsAsync(settingsId) {
    return async (dispatch) => {
        let getSettingsResponse = await SyncModule.listSettings(settingsId);
        
        if(getSettingsResponse.isSuccess) {
            let settingsModel = JSON.parse(getSettingsResponse.result);
            console.log(settingsModel);
            let syncSettings = settingsModel.syncSettings;

            syncSettings = settingsModel.syncStatus ? syncSettings | SYNC_ENUM.SYNC_ON : syncSettings &(~SYNC_ENUM.SYNC_ON);

            const newSettings = getObjectFromInt(syncSettings);

            dispatch(settingsActions.listSettings(newSettings));
        }
    };
}

export function changeSyncStatusAsync(settingsId, value) {
    return async (dispatch) => {
        value ? dispatch(settingsActions.syncOn()) : dispatch(settingsActions.syncOff());

        let changeSyncStatusResponse = await SyncModule.changeSyncStatus(settingsId, value);
        
        if(!changeSyncStatusResponse.isSuccess) {
            dispatch(settingsActions.syncOff());
        }
    };
}

export function setWifiConstraintAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.setWifiConstraint, 
            (settingsState) => settingsState.onWifi,
            (settingsState) => settingsState.onWifi = value);
    };
}

export function setChargingConstraintAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.setChargingConstraint, 
            (settingsState) => settingsState.onCharging,
            (settingsState) => settingsState.onCharging = value);
    };
}

export function syncPhotosAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.photosSync, 
            (settingsState) => settingsState.syncPhotos,
            (settingsState) => settingsState.syncPhotos = value);
    };
}

export function syncMoviesAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.moviesSync, 
            (settingsState) => settingsState.syncMovies,
            (settingsState) => settingsState.syncMovies = value);
    };
}

export function syncDocumentsAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.documentsSync, 
            (settingsState) => settingsState.syncDocuments,
            (settingsState) => settingsState.syncDocuments = value);
    };
}

export function syncMusicAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.musicSync, 
            (settingsState) => settingsState.syncMusic,
            (settingsState) => settingsState.syncMusic = value);
    };
}

async function _sync(dispatch, settingsId, value, settingsState, actionCallback, getterCallback, setterCallback) {
    dispatch(actionCallback(value));
    
    const prevValue = getterCallback(settingsState);
    setterCallback(settingsState, value);

    let updateSettingsResponse = await SyncModule.updateSyncSettings(settingsId, getIntFromObject(settingsState));
    
    if(!updateSettingsResponse.isSuccess) {
        dispatch(actionCallback(prevValue));
    }
}

export function setFirstSignInAsync(settingsId, value, callback) {
    return async (dispatch) => {
        let updateSettingsResponse = await SyncModule.setFirstSignIn(settingsId, value);

        if(updateSettingsResponse.isSuccess) {
            dispatch(settingsActions.listSettings(getObjectFromInt(value)));
        }

        callback(updateSettingsResponse);
    }    
}

function getObjectFromInt(settings) {
    return {
        syncStatus: settings & SYNC_ENUM.SYNC_ON ? true : false, 
        onWifi: settings & SYNC_ENUM.ON_WIFI ? true : false,
        onCharging: settings & SYNC_ENUM.ON_CHARGING ? true : false,
        syncPhotos: settings & SYNC_ENUM.SYNC_PHOTOS ? true : false,
        syncMovies: settings & SYNC_ENUM.SYNC_MOVIES ? true : false,
        syncDocuments: settings & SYNC_ENUM.SYNC_DOCUMENTS ? true : false,
        syncMusic: settings & SYNC_ENUM.SYNC_MUSIC ? true : false
    };
}

function getIntFromObject(settings) {
    let settingsInt = 0;

    settingsInt = settings.syncStatus ? settingsInt | SYNC_ENUM.SYNC_ON : settingsInt;
    settingsInt = settings.onWifi ? settingsInt | SYNC_ENUM.ON_WIFI : settingsInt;
    settingsInt = settings.onCharging ? settingsInt | SYNC_ENUM.ON_CHARGING : settingsInt;
    settingsInt = settings.syncPhotos ? settingsInt | SYNC_ENUM.SYNC_PHOTOS : settingsInt;
    settingsInt = settings.syncMovies ? settingsInt | SYNC_ENUM.SYNC_MOVIES : settingsInt;
    settingsInt = settings.syncDocuments ? settingsInt | SYNC_ENUM.SYNC_DOCUMENTS : settingsInt;
    settingsInt = settings.syncMusic ? settingsInt | SYNC_ENUM.SYNC_MUSIC : settingsInt;

    return settingsInt;
}

export const SYNC_ENUM = {
    SYNC_ON:        0b10000000,
    ON_WIFI:        0b01000000,
    ON_CHARGING:    0b00100000,
    SYNC_PHOTOS:    0b00010000,
    SYNC_MOVIES:    0b00001000,
    SYNC_DOCUMENTS: 0b00000100,
    SYNC_MUSIC:     0b00000010
};