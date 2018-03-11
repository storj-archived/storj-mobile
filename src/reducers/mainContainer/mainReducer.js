import { MAIN_ACTIONS } from '../../utils/constants/actionConstants';
import ListItemModel from '../../models/ListItemModel';
import FileModel from '../../models/FileModel';
import ItemManager from '../../utils/itemManagers/ItemManager';

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
    SET_GRID_VIEW,
    SET_LIST_VIEW,
    CLEAR_SELECTION,
    SET_SELECTION_ID,
    UPDATE_FAVOURITE
 } = MAIN_ACTIONS;
                                                        
const initialState = { 
    isCreateBucketInputShown: false,
    isActionBarShown: false,
    buckets: [],
    isSelectionMode: false,
    isSingleItemSelected: false,
    isFirstSignIn: false,
    isGridViewShown: false,
    isLoading: false,
    openedBucketId: null,
    selectedItemId: null
};

export default function mainReducer(state = initialState, action) {
    let newState = Object.assign({}, state);
    let bucketsManager = new ItemManager(newState.buckets);

    //TODO: we can call return after switch, and reduce lines of code
    switch(action.type) {
        case SHOW_ACTION_BAR:
            newState.isActionBarShown = true; 
            break;
        case HIDE_ACTION_BAR:
            newState.isActionBarShown = false;
            break;
        case SELECT_BUCKET:
            newState.buckets = bucketsManager.changeItemSelectionStatus(action.payload.bucket, true);            
            break;
        case DESELECT_BUCKET:
            newState.buckets = bucketsManager.changeItemSelectionStatus(action.payload.bucket, false);            
            break;
        case CREATE_BUCKET:
            newState.buckets = bucketsManager.addItem(action.payload.bucket);
            break;
        case DELETE_BUCKET:
            newState.buckets = bucketsManager.deleteItem(action.payload.bucketId);
            break;
        case GET_BUCKETS:
            newState.buckets = action.payload.buckets;
            break;
        case ENABLE_SELECTION_MODE:            
            newState.selectedItemId = null;
            newState.buckets = bucketsManager.clearSelection(); //???
            newState.isSelectionMode = true;
            newState.isSingleItemSelected = false;
            break;
        case DISABLE_SELECTION_MODE:
            newState.buckets = bucketsManager.clearSelection();
            newState.isSingleItemSelected = false;
            newState.isActionBarShown = false;
            newState.isSelectionMode = false;
            newState.selectedItemId = null;
            break;
        case SINGLE_ITEM_ACTIONS_SELECTED:                
            newState.isSingleItemSelected = true;
            newState.isActionBarShown = true;
            break;
        case SHOW_CREATE_BUCKET_INPUT:
            newState.isCreateBucketInputShown = true;
            newState.isActionBarShown = false;                        
            break;
        case HIDE_CREATE_BUCKET_INPUT:
            newState.isCreateBucketInputShown = false;
            break;
        case SET_FIRST_SIGN_IN: 
            newState.isFirstSignIn = true;
            break;
        case REMOVE_FIRST_SIGN_IN: 
            newState.isFirstSignIn = false;
            break;
        case SET_LOADING: 
            newState.isLoading = true;
            break;
        case UNSET_LOADING:
            newState.isLoading = false;
            break;
        case OPEN_BUCKET: 
            newState.openedBucketId = action.payload.bucketId;
            break;
        case CLOSE_BUCKET:
            newState.openedBucketId = null;
            break;
        case SET_GRID_VIEW: 
            newState.isGridViewShown = true;
            break;
        case SET_LIST_VIEW: 
            newState.isGridViewShown = false;
            break;
        case SET_SELECTION_ID:
            newState.selectedItemId = action.payload.id;
            break;
        case CLEAR_SELECTION:
            newState.selectedItemId = null;
            break;
        case UPDATE_FAVOURITE:
            newState.buckets = bucketsManager.updateStarred(action.payload.buckets, true);
            break;  
        default:
            return state || initialState;
    }
    
    return newState; 
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
    let isListHandler = false;

    for(let i = 0; i < newArray.length; i++) {
        if(newArray[i].bucketId === bucketId) {
            let doesContain = false;
            isListHandler = true;

            newArray[i].files.forEach(element => {
                if(element.Id === file.fileId)
                    doesContain = true;
            });

            if(!doesContain) {
                newArray[i].files.push(new ListItemModel(new FileModel(file)));
            }
        }
    }

    if(!isListHandler) {
        newArray.push({ bucketId, files: [ new ListItemModel(new FileModel(file)) ] });
    }

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