import { BUCKET_ACTIONS, MAIN_ACTIONS } from '../../../utils/constants/actionConstants';
import ItemManager from '../../../utils/itemManagers/itemManager';

const { 
    SELECT_BUCKET, 
    SELECT_BUCKETS,
    DESELECT_BUCKET,
    DESELECT_BUCKETS, 
    CREATE_BUCKET,
    DELETE_BUCKET,
    GET_BUCKETS, 
    UPDATE_FAVOURITE,
    SET_NAME_ALREADY_EXIST_EXCEPTION,
    UNSET_NAME_ALREADY_EXIST_EXCEPTION
 } = BUCKET_ACTIONS;

 const { 
    ENABLE_SELECTION_MODE, 
    DISABLE_SELECTION_MODE
 } = MAIN_ACTIONS;
                                                        
const initialState = {
    buckets: [],
    isNameExistException: false
};

export default function mainReducer(state = initialState, action) {
    let newState = Object.assign({}, state);
    let bucketsManager = new ItemManager(newState.buckets);

    switch(action.type) {
        case SELECT_BUCKET:
            newState.buckets = bucketsManager.changeItemSelectionStatus(action.payload.bucket, true);            
            break;
        case SELECT_BUCKETS:
            newState.buckets = bucketsManager.selectBuckets(action.filteredBuckets);           
            break;
        case DESELECT_BUCKET:
            newState.buckets = bucketsManager.changeItemSelectionStatus(action.payload.bucket, false);            
            break;
        case DESELECT_BUCKETS:
            newState.buckets = bucketsManager.clearSelection();
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
            newState.buckets = bucketsManager.clearSelection(); //???
            break;
        case DISABLE_SELECTION_MODE:
            newState.buckets = bucketsManager.clearSelection();//???
            break;
        case UPDATE_FAVOURITE:
            newState.buckets = bucketsManager.updateStarred(action.payload.buckets, action.payload.starredStatus);
            break;  
        case SET_NAME_ALREADY_EXIST_EXCEPTION:
            newState.isNameExistException = true;
            break;
        case UNSET_NAME_ALREADY_EXIST_EXCEPTION:
            newState.isNameExistException = false;
            break;
        default:
            return state || initialState;
    }

    return newState; 
};