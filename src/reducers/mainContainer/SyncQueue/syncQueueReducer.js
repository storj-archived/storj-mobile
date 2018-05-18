import { SYNC_QUEUE_ACTIONS } from "../../../utils/constants/actionConstants";

const {
    LIST_SYNC_QUEUE,
    UPDATE_SYNC_QUEUE_ENTRY
} = SYNC_QUEUE_ACTIONS;

const initialState = {
    syncQueueEntries: []
};

export default function syncQueueReducer(state = initialState, action) {
    let newState = Object.assign({}, state);

    switch(action.type) {
        case LIST_SYNC_QUEUE:
            newState.syncQueueEntries = action.payload.syncQueueEntries;
            break;
        case UPDATE_SYNC_QUEUE_ENTRY:
            newState.syncQueueEntries = modifyEntry(newState.syncQueueEntries, action.payload.syncQueueEntry);
            break;
        default:
            return state || initialState;
    }

    return newState;
}

function modifyEntry(array, updatedEntry) {
    return array.map(entry => {
        if(entry.getId() === updatedEntry.getId()) {
            entry = updatedEntry;
        }

        return entry;
    });
} 