import { MAIN_ACTIONS } from '../../utils/constants/actionConstants';
import ListItemModel from '../../models/ListItemModel';

const { 
    SELECT_BUCKET, 
    DESELECT_BUCKET, 
    CREATE_BUCKET,
    DELETE_BUCKET,
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
    let bucketsManager = new ItemManager(newState.buckets, newState.selectedBuckets);

    //TODO: we can call return after switch, and reduce lines of code
    switch(action.type) {
        case SHOW_ACTION_BAR:
            newState.isActionBarShown = true; 
            return newState; 
        case HIDE_ACTION_BAR:
            newState.isActionBarShown = false;
            return newState;
        case SELECT_BUCKET:
            newState.buckets = bucketsManager.changeItemSelectionStatus(action.payload.bucket, true);
            return newState;
        case DESELECT_BUCKET:
            newState.buckets = bucketsManager.changeItemSelectionStatus(action.payload.bucket, false);
            return newState;
        case CREATE_BUCKET:
            newState.buckets.push(action.payload.bucket);
            return newState;
        case DELETE_BUCKET:
            bucketsManager.deleteItem(action.payload.bucket);
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

/**
 * Helper class for working with items
 */
class ItemManager {
    /**
     * @param {ListItemModel[]} itemList 
     * @param {*} selectedBuckets 
     */
    constructor(itemList, selectedBuckets) {
        this.selectedBuckets = selectedBuckets;
        this.itemList = itemList;
    };

    /**
     * Change isSelected prop to value for selected item 
     * @param {ListItemModel} item selected item
     * @param {boolean} value value to set 
     * @returns {ListItemModel[]} 
     */
    changeItemSelectionStatus(item, value) {
        let index = this.itemList.indexOf(item);

        if(index > -1) {
            this.itemList[index].isSelected = value;
        }

        return this.itemList;
    };

    /**
     * Set isSelected prop of whole array to false
     * * @returns {ListItemModel[]}
     */
    clearSelection() {
        for(i = 0; i < this.itemList.length; i++) {
            this.itemList[i].isSelected = false;
        }

        return this.itemList;
    };

    /**
     * Delete item from array
     * @param {ListItemModel} item
     * @returns {ListItemModel[]} 
     */
    deleteItem(item) {
        let index = this.itemList.indexOf(item);

        if(index > -1) {
            this.itemList.splice(index, 1);
        }

        return this.itemList;
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