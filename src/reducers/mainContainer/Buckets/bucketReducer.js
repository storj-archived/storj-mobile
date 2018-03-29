import { BUCKET_ACTIONS } from '../../../utils/constants/actionConstants';
import ItemManager from '../../../utils/itemManagers/ItemManager';

const { 
    SELECT_BUCKET, 
    DESELECT_BUCKET, 
    CREATE_BUCKET,
    DELETE_BUCKET,
    GET_BUCKETS, 
    OPEN_BUCKET,
    CLOSE_BUCKET,
    UPDATE_FAVOURITE
 } = MAIN_ACTIONS;
                                                        
const initialState = {
    buckets: [],
    openedBucketId: null //?????
};

export default function mainReducer(state = initialState, action) {
    let newState = Object.assign({}, state);
    let bucketsManager = new ItemManager(newState.buckets);

    switch(action.type) {
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
            newState.buckets = bucketsManager.clearSelection(); //???
            break;
        case DISABLE_SELECTION_MODE:
            newState.buckets = bucketsManager.clearSelection();//???
            break;
        case OPEN_BUCKET: //?????
            newState.openedBucketId = action.payload.bucketId;
            break;
        case CLOSE_BUCKET://?????
            newState.openedBucketId = null;
            break;
        case UPDATE_FAVOURITE:
            newState.buckets = bucketsManager.updateStarred(action.payload.buckets, true);
            break;  
        default:
            return state || initialState;
    }
    
    return newState; 
};