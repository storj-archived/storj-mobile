import { MAIN_ACTIONS } from '../../utils/constants/actionConstants';
import { SYNC_BUCKETS } from '../../utils/constants/SyncBuckets';
import ServiceModule from '../../utils/ServiceModule';

const { PICTURES } = SYNC_BUCKETS;

const { 
    SHOW_ACTION_BAR, 
    HIDE_ACTION_BAR, 
    ENABLE_SELECTION_MODE,
    SINGLE_ITEM_ACTIONS_SELECTED, 
    DISABLE_SELECTION_MODE,
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
    UPLOAD_FILE_COMPLETE,
    SET_GRID_VIEW,
    SET_LIST_VIEW,
    CLEAR_SELECTION,
    SET_SELECTION_ID,    
    SET_EMAIL,    
    SET_PHOTOS_BUCKET_ID,
    SET_SORTING,
    SET_DASHBOARD_BUCKET_ID,
    PUSH_LOADING,
    POP_LOADING,
    SET_SEARCH,
    CLEAR_SEARCH,
    SET_IS_CONNECTED,
    CHANGE_PIN_OPTIONS_STATUS,
    CHANGE_PASSWORD_POPUP_STATUS,
    SET_BUCKETID_TO_COPY
} = MAIN_ACTIONS;

/**
 * Action for changing isConnected to interted state
 * @param {bool} isConnected - indicates state of internet conection
 */
export function setIsConnected(isConnected) {
    return { type: SET_IS_CONNECTED, payload: { isConnected } };
}

export function setEmail(email) {
    return { type: SET_EMAIL, payload: { email } };
}

export function onSingleItemSelected() {
    return { type: SINGLE_ITEM_ACTIONS_SELECTED };
}

export function showActionBar() {
    return { type: SHOW_ACTION_BAR };
}

export function hideActionBar() {
    return { type: HIDE_ACTION_BAR };
}

export function enableSelectionMode() {
    return { type: ENABLE_SELECTION_MODE };
}

export function disableSelectionMode() {
    return { type: DISABLE_SELECTION_MODE };
}

export function showCreateBucketInput() {
    return { type: SHOW_CREATE_BUCKET_INPUT };
}

export function hideCreateBucketInput() {
    return { type: HIDE_CREATE_BUCKET_INPUT };
}

export function setFirstSignIn() {
    return { type: SET_FIRST_SIGN_IN };
}

export function removeFirstSignIn() {
    return { type: REMOVE_FIRST_SIGN_IN };
}

export function setLoading() {
    return { type: SET_LOADING };
}

export function unsetLoading() {
    return { type: UNSET_LOADING };
}

export function openBucket(bucketId) {
    return { type: OPEN_BUCKET, payload: { bucketId } };
}

export function closeBucket() {
    return { type: CLOSE_BUCKET };
}

export function listFiles(filesHandler) {
    return { type: LIST_FILES, payload: { filesHandler } };
}

export function uploadFile(file) {
    return { type: UPLOAD_FILE, payload: { file } }
}

export function uploadFileStart(bucketId, filePath) {
    return { type: UPLOAD_FILE_START, payload: { bucketId, filePath } }
}

export function completeFileUploading(uploadResponse) {
    return { type: UPLOAD_FILE_COMPLETE, payload: { uploadResponse } };
}

export function setGridView() {
    return { type: SET_GRID_VIEW }
}

export function setListView() {
    return { type: SET_LIST_VIEW }
}

export function setSelectionId(id) {
    return { type: SET_SELECTION_ID, payload: { id }}
}

export function clearSelection() {
    return { type: CLEAR_SELECTION }
}

export function setPhotosBucketId(id) {
    return { type: SET_PHOTOS_BUCKET_ID, payload: { myPhotosBucketId: id } }
}

export function setDashboardBucketId(id) {
    return { type: SET_DASHBOARD_BUCKET_ID, payload: { dashboardBucketId: id } }
}

export function pushLoading(value) {
    return { type: PUSH_LOADING, payload: { value } };
}

export function popLoading(value) {
    return { type: POP_LOADING, payload: { value } };
}

export function setSorting(sortingMode) {
    return { type: SET_SORTING, payload: { sortingMode } }
}

export function setSearch(index, searchSubSequence) {
    return { type: SET_SEARCH, payload: { index, searchSubSequence }}
}

export function clearSearch(index) {
    return { type: CLEAR_SEARCH, payload: { index }}
} 

export function changePINOptionStatus(status) {
    return { type: CHANGE_PIN_OPTIONS_STATUS, payload: { status } }
}

export function changePasswordPopupStatus(status) {
    return { type: CHANGE_CHANGE_PASSWORD_POPUP_STATUS, payload: { status } }
}

export function setBucketIdToCopy(id) {
    return { type: SET_BUCKETID_TO_COPY, payload: { id } }
}

export function getPicturesBucketId(buckets) {
    if(!buckets || buckets.length === 0) return;
    
    ServiceModule.createBaseBuckets(buckets);

    let picturesBucket;

    picturesBucket = buckets.find(element => {
        return element.getName() === PICTURES;
    });

    if(picturesBucket) {
        return picturesBucket.entity.id;
    } 
}

//action creators for main container
export const mainContainerActions = {
    showActionBar,
    hideActionBar,
    disableSelectionMode,
    showCreateBucketInput,
    hideCreateBucketInput,
    clearSelection,
    setFirstSignIn,
    removeFirstSignIn,
    setLoading,
    unsetLoading,
    setGridView,
    setListView,
    openBucket,
    pushLoading,
    popLoading,
    setSorting
};

//action creators for bucket screen
export const bucketsContainerActions = {
    enableSelectionMode,
    removeFirstSignIn,
    disableSelectionMode,
    onSingleItemSelected,
    setLoading,
    unsetLoading,
    setSelectionId,
    closeBucket,
    setSearch,
    clearSearch
};

export const dashboardContainerActions = {
    enableSelectionMode,
    disableSelectionMode,
    onSingleItemSelected,
    removeFirstSignIn,
    setLoading,
    unsetLoading,
    setSelectionId,
    setDashboardBucketId,
    clearSearch
}

export const initializeContainerActions = {
    setFirstSignIn,
    setEmail
};

export const bucketsListContainerActions = {
    onSingleItemSelected,
    enableSelectionMode,
    disableSelectionMode,
    setSelectionId,
    openBucket
};

export const filesListContainerMainActions = {
    disableSelectionMode,
    onSingleItemSelected,
    closeBucket,
    setLoading,
    setSelectionId,
    enableSelectionMode,
    disableSelectionMode, 
    unsetLoading,
    pushLoading,
    popLoading
};

export const myPicturesListContainerMainActions = {    
    onSingleItemSelected,
    closeBucket,
    setLoading,
    enableSelectionMode,
    disableSelectionMode, 
    unsetLoading,
    openBucket,
    setSelectionId,
    pushLoading,
    popLoading,
    setSearch,
    clearSearch
};

export const setCurrentMainScreenActions = {
    setPhotosBucketId,
    hideActionBar,
    pushLoading,
    popLoading
}

export const navigationContainerMainActions = {
    setIsConnected
}