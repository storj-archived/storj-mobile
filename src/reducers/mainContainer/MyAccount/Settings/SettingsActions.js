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
    DOWNLOADS_SYNC
} = SETTINGS_ACTIONS;

function listSettings(settings) {
    return {
        type: LIST_SETTINGS,
        payload: { settings }
    };
}

function syncOn() {
    return {
        type: SYNC_ON
    };
}

function syncOff() {
    return {
        type: SYNC_OFF
    };
}

function setWifiConstraint(value) {
    return {
        type: SET_WIFI_CONSTRAINT,
        payload: { value: value ? value : false }
    };
}

function setChargingConstraint(value) {
    return {
        type: SET_CHARGING_CONSTRAINT,
        payload: { value: value ? value : false }
    };
}

function photosSync(value) {
    return {
        type: PHOTOS_SYNC,
        payload: { value: value ? value : false }
    };
}

function moviesSync(value) {
    return {
        type: MOVIES_SYNC,
        payload: { value: value ? value : false }
    };
}

function documentsSync(value) {
    return {
        type: DOCUMENTS_SYNC,
        payload: { value: value ? value : false }
    };
}

function downloadsSync(value) {
    return {
        type: DOWNLOADS_SYNC,
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
    downloadsSync
};