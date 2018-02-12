import { MAIN_ACTIONS } from '../../utils/constants/actionConstants';
import ListItemModel from '../../models/ListItemModel';
import FileModel from '../../models/FileModel';

const { 
    SELECT_BUCKET, 
    DESELECT_BUCKET, 
    CREATE_BUCKET,
    DELETE_BUCKET,
    GET_BUCKETS, 
    SHOW_ACTION_BAR, 
    HIDE_ACTION_BAR,
    ENABLE_SELECTION_MODE, 
    DISABLE_SELECTION_MODE,
    SINGLE_ITEM_ACTIONS_SELECTED,
    SHOW_CREATE_BUCKET_INPUT,
    HIDE_CREATE_BUCKET_INPUT,
    SET_FIRST_SIGN_IN,
    REMOVE_FIRST_SIGN_IN,
    SET_LOADING,
    UNSET_LOADING,
    OPEN_BUCKET,
    CLOSE_BUCKET,
    LIST_FILES,
    UPLOAD_FILE,
    UPLOAD_FILE_START,
    UPLOAD_FILE_COMPLETE
 } = MAIN_ACTIONS;
                                                        
const initialState = { 
    isCreateBucketInputShown: false,
    isActionBarShown: false,
    buckets: [],
    files: [],
    selectedBuckets: [], //TODO: delete, depreciated
    isSelectionMode: false,
    isSingleItemSelected: false,
    isFirstSignIn: false,
    isLoading: false,
    openedBucketId: null
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
            newState.buckets = bucketsManager.addItem(action.payload.bucket);
            return newState;
        case DELETE_BUCKET:
            newState.buckets = bucketsManager.deleteItem(action.payload.bucket);
            return newState;
        case GET_BUCKETS:
            newState.buckets = action.payload.buckets;
            return newState;
        case ENABLE_SELECTION_MODE:
            newState.buckets = bucketsManager.clearSelection();
            newState.isSelectionMode = true;
            return newState;
        case DISABLE_SELECTION_MODE:
            newState.isSingleItemSelected = false;
            newState.isActionBarShown = false;
            newState.buckets = bucketsManager.clearSelection();
            newState.isSelectionMode = false;
            return newState;
        case SINGLE_ITEM_ACTIONS_SELECTED:                
            newState.isSingleItemSelected = true;
            newState.isActionBarShown = true;
            return newState;
        case SHOW_CREATE_BUCKET_INPUT:
            newState.isCreateBucketInputShown = true;
            newState.isActionBarShown = false;                        
            return newState;
        case HIDE_CREATE_BUCKET_INPUT:
            newState.isCreateBucketInputShown = false;
            return newState;
        case SET_FIRST_SIGN_IN: 
            newState.isFirstSignIn = true;
            return newState;
        case REMOVE_FIRST_SIGN_IN: 
            newState.isFirstSignIn = false;
            return newState;
        case SET_LOADING: 
            newState.isLoading = true;
            return newState;
        case UNSET_LOADING:
            newState.isLoading = false;
            return newState;
        case OPEN_BUCKET: 
            newState.openedBucketId = action.payload.bucketId;
            return newState;
        case CLOSE_BUCKET:
            newState.openedBucketId = null;
            return newState;
        case LIST_FILES:
            newState.files = listFiles(newState.files, action.payload.filesHandler);
            return newState;
        case UPLOAD_FILE:
            console.log(action);
            newState.files = uploadFile(newState.files, newState.openedBucketId, action.payload.file);
            return newState;
        case UPLOAD_FILE_START:
            newState.files = addUploadingFile(newState.files, action.payload.filePath, newState.openedBucketId);
            return newState;
        case UPLOAD_FILE_COMPLETE:
            newState.files = completeFileUploading(newState.files, action.payload.uploadResponse, newState.openedBucketId)
            return newState;
        default:
            return state || initialState;
    }
};

function listFiles(array, newItem) {
    let doesContain = false;
    let newArray = array.slice();

    for(let i = 0; i < newArray.length; i++) {
        if(newArray[i].bucketId === newItem.bucketId) {
            newArray[i] = newItem;
            doesContain = true;
        }
    }

    if(!doesContain) {
        newArray.push(newItem);
    }

    return newArray;
}

function uploadFile(array, bucketId, file) {
    let newArray = array.slice();

    for(let i = 0; i < newArray.length; i++) {
        if(newArray[i].bucketId === bucketId) {
            let doesContain = false;

            newArray[i].files.forEach(element => {
                if(element.Id === file.id)
                    doesContain = true;
            });

            if(!doesContain) {
                newArray[i].files.push(new ListItemModel(new FileModel(file)));
            }
        }
    }

    console.log("newArray", newArray);

    return newArray;
}

function addUploadingFile(array, filePath, bucketId) {
    let newArray = array.slice();

    for(let i = 0; i < newArray.length; i++) {
        if(newArray[i].bucketId === bucketId) {
            newArray[i].files.push(new ListItemModel(new FileModel({ name: filePath, id: null, created: null })));
        }
    }

    return newArray;
}

function completeFileUploading(array, uploadResponse, bucketId) {
    let newArray = array.slice();

    let actionSuccess = (entry, filePath, newFile) => {
        if(entry.Name === filePath) {
            return new ListItemModel(new FileModel(newFile)); 
        }

        return entry;
    };

    let actionFailure = (entry, filePath) => {
        if(entry.Name === filePath) {
            return null;
        }

        return entry;
    };

    let action = uploadResponse.isSuccess ? actionSuccess : actionFailure;

    for(let i = 0; i < newArray.length; i++) {
        if(newArray[i].bucketId === bucketId) {
            for(let y = 0; y < newArray[i].files.length; y++) {
                newArray[i].files[y] = action(newArray[i].files[y], uploadResponse.result.filePath, uploadResponse.result.file);
            }
        }
    }



    return newArray;
}

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
        this.itemList = itemList.slice();
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
     * Add item to array
     * @param {ListItemModel} item
     * @returns {ListItemModel[]} 
     */
    addItem(item) {
        this.itemList.push(item);

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