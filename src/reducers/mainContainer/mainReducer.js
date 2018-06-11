import { MAIN_ACTIONS } from '../../utils/constants/actionConstants';
import LoadingStack from "../../utils/loadingStack";
import SORTING from '../../utils/constants/sortingConstants';

const { 
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
    SET_EMAIL,
    SET_PHOTOS_BUCKET_ID,
    SET_DASHBOARD_BUCKET_ID,
    SET_SORTING,
    PUSH_LOADING,
    POP_LOADING,
    SET_SEARCH,
    CLEAR_SEARCH,
    SET_IS_CONNECTED,
    CHANGE_PIN_OPTIONS_STATUS,
    CHANGE_PASSWORD_POPUP_STATUS,
    SET_BUCKETID_TO_COPY,
    CHANGE_SYNC_WINDOW_POPUP_STATUS
 } = MAIN_ACTIONS; 

const initialState = {
    email: null,
    isCreateBucketInputShown: false,
    isActionBarShown: false,
    isSelectionMode: false,
    isSingleItemSelected: false,
    isFirstSignIn: false,
    isGridViewShown: false,
    isLoading: false,
    openedBucketId: null,
    myPhotosBucketId: null,
    dashboardBucketId: null,
    selectedItemId: null,
    sortingMode: SORTING.BY_DATE,
    myPhotosSearchSubSequence: null,
    bucketSearchSubSequence: null,
    filesSearchSubSequence: null,
    starredSearchSubSequence: null,
    dashboardFilesSearchSubSequence: null,
    selectBucketsSearchSubSequence: null,
    loadingStack: [],
    isConnected: true,
    isPinOptionsShown: false,
    isChangePasswordPopupShown: false,
    bucketIdToCopy: null, 
    
    isSyncWindowShown: false
};

export default function mainReducer(state = initialState, action) {
    let newState = Object.assign({}, state);
    const loadingStack = new LoadingStack(newState.loadingStack);

    //TODO: we can call return after switch, and reduce lines of code
    switch(action.type) {
        case CHANGE_SYNC_WINDOW_POPUP_STATUS:
            newState.isSyncWindowShown = action.payload.value;
            break; 
        case SET_IS_CONNECTED:
            newState.isConnected = action.payload.isConnected;
            break;
        case SET_EMAIL:
            newState.email = action.payload.email;
            break;
        case SHOW_ACTION_BAR:
            newState.isActionBarShown = true; 
            break;
        case HIDE_ACTION_BAR:
            newState.isActionBarShown = false;
            break;
        case ENABLE_SELECTION_MODE:            
            newState.selectedItemId = null;            
            newState.isSelectionMode = true;
            newState.isSingleItemSelected = false;
            break;
        case DISABLE_SELECTION_MODE:
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
        case SET_PHOTOS_BUCKET_ID:            
            newState.myPhotosBucketId = action.payload.myPhotosBucketId
            break;
        case SET_DASHBOARD_BUCKET_ID:            
            newState.dashboardBucketId = action.payload.dashboardBucketId
            break;
        case PUSH_LOADING:
            newState.loadingStack = loadingStack.setLoading(action.payload.value);
            break;
        case POP_LOADING:
            newState.loadingStack = loadingStack.unsetLoading(action.payload.value);
            break;
        case SET_SORTING:            
            newState.sortingMode = action.payload.sortingMode;
            break;
        case SET_SEARCH:
            setSearch(newState, action.payload.index, action.payload.searchSubSequence);                        
            break;
        case CLEAR_SEARCH:
            setSearch(newState, action.payload.index, null);
            break;
        case CHANGE_PIN_OPTIONS_STATUS:
            newState.isPinOptionsShown = action.payload.status;
            break;
        case CHANGE_PASSWORD_POPUP_STATUS: 
            newState.isChangePasswordPopupShown = action.payload.status;
            break;
        case SET_BUCKETID_TO_COPY: 
            if(!action.payload.id) break;
            newState.bucketIdToCopy = action.payload.id;
            break;
        default:
            return state || initialState;
    }
    
    return newState; 
};

function setSearch(newState, index, value) {
    switch(index) {
        case 0 : newState.myPhotosSearchSubSequence = value; break;
        case 1 : newState.bucketSearchSubSequence = value; break;
        case 2 : newState.filesSearchSubSequence = value; break;
        case 3 : newState.starredSearchSubSequence = value; break;
        case 4 : newState.dashboardFilesSearchSubSequence = value; break;
        case 5 : newState.selectBucketsSearchSubSequence = value; break;
    }
}