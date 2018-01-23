import { MAIN_ACTIONS } from '../../utils/constants/actionConstants';

const { 
    SELECT_BUCKET, 
    DESELECT_BUCKET, 
    CREATE_BUCKET, 
    GET_BUCKETS, 
    SHOW_ACTION_BAR, 
    HIDE_ACTION_BAR,
    ENABLE_SELECTION_MODE, 
    DISABLE_SELECTION_MODE
 } = MAIN_ACTIONS;
                                                        
const initialState = { 
    isActionBarShown: false, 
    buckets: [], 
    selectedBuckets: [], //TODO: delete, depreciated
    isSelectionMode: false
};

export default function mainReducer(state = initialState, action) {
    let newState = Object.assign({}, state);
    let bucketsManager = new BucketsManager(newState.buckets, newState.selectedBuckets);

    switch(action.type) {
        case SHOW_ACTION_BAR:
            newState.isActionBarShown = true; 
            return newState; 
        case HIDE_ACTION_BAR:
            newState.isActionBarShown = false;
            return newState;
        case SELECT_BUCKET:
            newState.buckets = bucketsManager.changeBucketSelectionStatus(action.payload.bucket, true);
            return newState;
        case DESELECT_BUCKET:
            newState.buckets = bucketsManager.changeBucketSelectionStatus(action.payload.bucket, false);
            return newState;
        case CREATE_BUCKET:
            newState.buckets.push(action.payload.bucket);
            return newState;
        case GET_BUCKETS:
            newState.buckets = action.payload.buckets;
            return newState;
        case ENABLE_SELECTION_MODE:
            newState.isSelectionMode = true;
            return newState;
        case DISABLE_SELECTION_MODE:
            newState.isSelectionMode = false;
            newState.buckets = bucketsManager.clearSelection();
            return newState;
        default:
            return state || initialState;
    }
};

class BucketsManager {
    constructor(buckets, selectedBuckets) {
        this.selectedBuckets = selectedBuckets;
        this.buckets = buckets;
    };

    changeBucketSelectionStatus(bucket, value) {
        let index = this.buckets.indexOf(bucket);

        if(index > -1) {
            this.buckets[index].isSelected = value;
        }

        return this.buckets;
    };

    clearSelection() {
        for(i = 0; i < this.buckets.length; i++) {
            this.buckets[i].isSelected = false;
        }

        return this.buckets;
    };

    //TODO: delete, depreciated
    _selectBucket(bucketId) {
        let isBucketSelected = false;

        for(let i = 0; i < this.selectedBuckets.length; i++) {
            if(this.selectedBuckets[i] === bucketId) isBucketSelected = true;
        };

        if(!isBucketSelected)
            this.selectedBuckets.push(bucketId);

        return this.selectedBuckets;
    };

    //TODO: delete, depreciated
    _deselectBucket(bucketId) {
        let index = this.selectedBuckets.indexOf(bucketId);
            
        if(index > -1) {
            this.selectedBuckets.splice(index, 1);
        }

        return this.selectedBuckets;
    };
}