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
    SET_DASHBOARD_BUCKET_ID,
    PUSH_LOADING,
    POP_LOADING
} = MAIN_ACTIONS;

function setEmail(email) {
    return { type: SET_EMAIL, payload: { email } };
}

function onSingleItemSelected() {
    return { type: SINGLE_ITEM_ACTIONS_SELECTED };
}

function showActionBar() {
    return { type: SHOW_ACTION_BAR };
}

function hideActionBar() {
    return { type: HIDE_ACTION_BAR };
}

function enableSelectionMode() {
    return { type: ENABLE_SELECTION_MODE };
}

function disableSelectionMode() {
    return { type: DISABLE_SELECTION_MODE };
}

function showCreateBucketInput() {
    return { type: SHOW_CREATE_BUCKET_INPUT };
}

function hideCreateBucketInput() {
    return { type: HIDE_CREATE_BUCKET_INPUT };
}

function setFirstSignIn() {
    return { type: SET_FIRST_SIGN_IN };
}

function removeFirstSignIn() {
    return { type: REMOVE_FIRST_SIGN_IN };
}

function setLoading() {
    return { type: SET_LOADING };
}

function unsetLoading() {
    return { type: UNSET_LOADING };
}

function openBucket(bucketId) {
    return { type: OPEN_BUCKET, payload: { bucketId } };
}

function closeBucket() {
    return { type: CLOSE_BUCKET };
}

function listFiles(filesHandler) {
    return { type: LIST_FILES, payload: { filesHandler } };
}

function uploadFile(file) {
    return { type: UPLOAD_FILE, payload: { file } }
}

function uploadFileStart(bucketId, filePath) {
    return { type: UPLOAD_FILE_START, payload: { bucketId, filePath } }
}

function completeFileUploading(uploadResponse) {
    return { type: UPLOAD_FILE_COMPLETE, payload: { uploadResponse } };
}

function setGridView() {
    return { type: SET_GRID_VIEW }
}

function setListView() {
    return { type: SET_LIST_VIEW }
}

function setSelectionId(id) {
    return { type: SET_SELECTION_ID, payload: { id }}
}

function clearSelection() {
    return { type: CLEAR_SELECTION }
}

function setPhotosBucketId(id) {
    return { type: SET_PHOTOS_BUCKET_ID, payload: { myPhotosBucketId: id } }
}

function setDashboardBucketId(id) {
    return { type: SET_DASHBOARD_BUCKET_ID, payload: { dashboardBucketId: id } }
}

function pushLoading(value) {
    return { type: PUSH_LOADING, payload: { value } };
}

function popLoading(value) {
    return { type: POP_LOADING, payload: { value } };
}

export function getPicturesBucketId(buckets) {
    if(!buckets || buckets.length === 0) return;
    
    ServiceModule.createBaseBuckets(buckets);

    let picturesBucket;

    picturesBucket = buckets.find(element=>{

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
    popLoading
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
    closeBucket
};

export const dashboardContainerActions = {
    enableSelectionMode,
    disableSelectionMode,
    onSingleItemSelected,
    removeFirstSignIn,
    setLoading,
    unsetLoading,
    setSelectionId,
    setDashboardBucketId
}

export const initializeContainerActions = {
    setFirstSignIn,
    setEmail
};

export const bucketsListContainerActions = {
    removeFirstSignIn,
    onSingleItemSelected,
    enableSelectionMode,
    disableSelectionMode,
    openBucket
};

export const filesListContainerMainActions = {
    disableSelectionMode,
    onSingleItemSelected,
    closeBucket,
    setLoading,
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
    popLoading
};

export const setCurrentMainScreenActions = {
    setPhotosBucketId,
    hideActionBar,
    pushLoading,
    popLoading
}