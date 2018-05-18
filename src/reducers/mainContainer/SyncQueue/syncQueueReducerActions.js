import { SYNC_QUEUE_ACTIONS } from "../../../utils/constants/actionConstants";

const {
    LIST_SYNC_QUEUE,
    UPDATE_SYNC_QUEUE_ENTRY
} = SYNC_QUEUE_ACTIONS;

export function listSyncQueueEntries(syncQueueEntries) {
    return { type: LIST_SYNC_QUEUE, payload: { syncQueueEntries } };
}

export function updateSyncQueueEntry(syncQueueEntry) {
    return { type: UPDATE_SYNC_QUEUE_ENTRY, payload: { syncQueueEntry } };
}