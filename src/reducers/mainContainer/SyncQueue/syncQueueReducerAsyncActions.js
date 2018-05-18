import { listSyncQueueEntries, updateSyncQueueEntry } from "./syncQueueReducerActions";
import SyncModule from "../../../utils/SyncModule";
import SyncQueueEntryModel from "../../../models/SyncQueueEntryModel";
import ListItemModel from "../../../models/ListItemModel";
import SyncState from "../../../utils/constants/SyncState";

export function listSyncQueueEntriesAsync(syncQueueEntries) {
    return async (dispatch) => {
        let listQueueEntriesResponse = await SyncModule.getSyncQueue();

        if(listQueueEntriesResponse.isSuccess) {
            let syncQueueEntries = JSON.parse(listQueueEntriesResponse.result);
            syncQueueEntries = syncQueueEntries.map(syncQueueEntry => new ListItemModel(SyncQueueEntryModel.fromModel(syncQueueEntry), false, syncQueueEntry.status == SyncState.PROCESSING));

            dispatch(listSyncQueueEntries(syncQueueEntries));
        }
    }
}

export function updateSyncQueueEntryFileNameAsync(id, newFileName) {
    return async (dispatch) => {
        let response = await SyncModule.updateSyncQueueEntryFileName(id, newFileName);

        processUpdateResponse(dispatch, response);
    }
}

export function updateSyncQueueEntryStatusAsync(id, newStatus) {
    return async (dispatch) => {
        let response = await SyncModule.updateSyncQueueEntryStatus(id, newStatus);

        processUpdateResponse(dispatch, response);
    }
}

export function getSyncQueueEntryAsync(id) {
    return async (dispatch) => {
        let response = await SyncModule.getSyncQueueEntry(id);

        processUpdateResponse(dispatch, response);
    }
}

function processUpdateResponse(dispatch, response) {
    if(response.isSuccess) {
        let syncQueueEntry = JSON.parse(response.result);
        syncQueueEntry = new ListItemModel(SyncQueueEntryModel.fromModel(syncQueueEntry), false, syncQueueEntry.status == SyncState.PROCESSING);

        dispatch(updateSyncQueueEntry(syncQueueEntry));
    }
}