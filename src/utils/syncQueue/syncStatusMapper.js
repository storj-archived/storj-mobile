import SyncState from "../constants/syncState";
import GetFromCodeCallback from "./getFromCodeCallback";

const _emptyFunc = () => {};

const statusCallback = new GetFromCodeCallback({
    queued: () => "Waiting...",
    error: () => "Failed",
    cancelled: () => "Cancelled",
    processing: () => "Loading...",
    processed: () => "Synced",
    idle: () => "Ready for sync",
    default: () => "WrongStatusCode"
});  

export function getSyncStatusFromCode(code) {
    return _getFromCode(code, statusCallback);
}

const actionIconsCallback = new GetFromCodeCallback();
actionIconsCallback.QueuedCallback = () => require("../../images/Icons/CancelDownload.png");
actionIconsCallback.ErrorCallback = () => require("../../images/Icons/Retry.png");
actionIconsCallback.CancelledCallback = () => require("../../images/Icons/Retry.png");
actionIconsCallback.ProcessingCallback = () => require("../../images/Icons/CancelDownload.png");
actionIconsCallback.ProcessedCallback = () => null;
actionIconsCallback.IdleCallback = () => require("../../images/Icons/CancelDownload.png");
actionIconsCallback.DefaultCallback = () => null;

export function getActionIconFromCode(code) {
    return _getFromCode(code, actionIconsCallback);
}

export function getActionsFromCode(code, callbackHandler) {

    const actionsCallback = new GetFromCodeCallback({
        queued: () => callbackHandler.Queued,
        error: () => callbackHandler.Error,
        cancelled: () => callbackHandler.Cancelled,
        processing: () => callbackHandler.Processing,
        processed: () => callbackHandler.Processed,
        idle: () => callbackHandler.Idle
    });  

    return _getFromCode(code, actionsCallback);
}

export function getAllFromCode(code, callbackHandler) {

    const actionsCallback = new GetFromCodeCallback({
        queued: () => new DescribingModel(callbackHandler.Queued, actionIconsCallback.queued(), statusCallback.queued()),
        error: () => new DescribingModel(callbackHandler.Error, actionIconsCallback.error(), statusCallback.error(), false, true),
        cancelled: () => new DescribingModel(callbackHandler.Cancelled, actionIconsCallback.cancelled(), statusCallback.cancelled(), false, true),
        processing: () => new DescribingModel(callbackHandler.Processing, actionIconsCallback.processing(), statusCallback.processing(), true),
        processed: () => new DescribingModel(callbackHandler.Processed, actionIconsCallback.processed(), statusCallback.processed()),
        idle: () => new DescribingModel(callbackHandler.Idle, actionIconsCallback.idle(), statusCallback.idle()),
        default: () => new DescribingModel(_emptyFunc, actionIconsCallback.default(), statusCallback.default())
    });

    return _getFromCode(code, actionsCallback);
}

export const getIsLoading = (code) => code === SyncState.PROCESSING;

function _getFromCode(code, callback) {
    switch(code) {
        case SyncState.QUEUED:
            return callback.queued();
        case SyncState.ERROR:
            return callback.error();
        case SyncState.CANCELLED:
            return callback.cancelled();
        case SyncState.PROCESSING:
            return callback.processing();
        case SyncState.PROCESSED:
            return callback.processed();
        case SyncState.IDLE:
            return callback.idle();
        default:
            return callback.default();
    }
}

class DescribingModel {
    constructor(action ,actionIcon, status, isLoading, error) {
        this.action = action;
        this.actionIcon = actionIcon;
        this.status = status;
        this.isLoading = isLoading;
        this.error = error;
    }
}