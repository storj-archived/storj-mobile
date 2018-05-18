import SyncState from "./constants/SyncState";

export function getSyncStatusFromCode(code) {
    switch(code) {
        case SyncState.QUEUED:
            return "Waiting...";
        case SyncState.ERROR:
            return "Failed";
        case SyncState.CANCELLED:
            return "Cancelled";
        case SyncState.PROCESSING:
            return "Loading...";
        case SyncState.PROCESSED:
            return "Synced!";
        case SyncState.IDLE:
            return "Ready for sync";
        default:
            return "WrongStatusCode";
    }
}

export function getActionIconFromCode(code) {
    switch(code) {
        case SyncState.QUEUED:
            return require("../images/Icons/CancelDownload.png");
        case SyncState.ERROR:
            return require("../images/Icons/BlueShare.png");
        case SyncState.CANCELLED:
            return require("../images/Icons/BlueShare.png");
        case SyncState.PROCESSING:
            return require("../images/Icons/CancelDownload.png");
        case SyncState.PROCESSED:
            return require("../images/Icons/GridItemSelected.png");
        default:
            return "WrongStatusCode";
    }
}