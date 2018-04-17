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
    MUSIC_SYNC,
} = SETTINGS_ACTIONS;

export function listSettings(settings) {
    return {
        type: LIST_SETTINGS,
        payload: { settings }
    };
}

export function syncOn() {
    return {
        type: SYNC_ON
    };
}

export function syncOff() {
    return {
        type: SYNC_OFF
    };
}

export function setWifiConstraint(value) {
    return {
        type: SET_WIFI_CONSTRAINT,
        payload: { value: value ? value : false }
    };
}

export function setChargingConstraint(value) {
    return {
        type: SET_CHARGING_CONSTRAINT,
        payload: { value: value ? value : false }
    };
}

export function photosSync(value) {
    return {
        type: PHOTOS_SYNC,
        payload: { value: value ? value : false }
    };
}

export function moviesSync(value) {
    return {
        type: MOVIES_SYNC,
        payload: { value: value ? value : false }
    };
}

export function documentsSync(value) {
    return {
        type: DOCUMENTS_SYNC,
        payload: { value: value ? value : false }
    };
}

export function musicSync(value) {
    return {
        type: MUSIC_SYNC,
        payload: { value: value ? value : false }
    };
}

export default {
    listSettings,
    syncOn,
    syncOff,
    setWifiConstraint,
    setChargingConstraint,
    photosSync,
    moviesSync,
    documentsSync,
    musicSync
};