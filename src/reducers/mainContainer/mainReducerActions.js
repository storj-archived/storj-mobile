import { MAIN_ACTIONS } from '../../utils/constants/actionConstants';

const { 
    SELECT_BUCKET, 
    DESELECT_BUCKET, 
    CREATE_BUCKET,
    DELETE_BUCKET,
    GET_BUCKETS, 
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
    UPLOAD_FILE_COMPLETE
} = MAIN_ACTIONS;

function onSingleItemSelected() {
    return { type: SINGLE_ITEM_ACTIONS_SELECTED };
}

function selectBucket(bucket) {
    return { type: SELECT_BUCKET, payload: { bucket } };
}

function deselectBucket(bucket) {
    return { type: DESELECT_BUCKET, payload: { bucket } };
}
function createBucket(bucket) {
    return { type: CREATE_BUCKET, payload: { bucket } };
}

function deleteBucket(bucket) {
    return { type: DELETE_BUCKET, payload: { bucket } };
}

function getBuckets(buckets) {
    return { type: GET_BUCKETS, payload: { buckets } };
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

//action creators for main container
export const mainContainerActions = {
    getBuckets,
    showActionBar,
    hideActionBar,
    createBucket,
    deleteBucket,
    disableSelectionMode,
    showCreateBucketInput,
    hideCreateBucketInput,
    setFirstSignIn,
    removeFirstSignIn,
    setLoading,
    unsetLoading
};

//action creators for main screen navigation container
export const mainNavContainerActions = {
    selectBucket,
    deselectBucket,
    enableSelectionMode
};

//action creators for bucket screen
export const bucketsContainerActions = {
    selectBucket,
    deselectBucket,
    enableSelectionMode,
    disableSelectionMode,
    onSingleItemSelected,
    createBucket,
    removeFirstSignIn,
    setLoading,
    unsetLoading
};

export const initializeContainerActions = {
    getBuckets, 
    setFirstSignIn
};

export const bucketsListContainerActions = {
    onSingleItemSelected,
    enableSelectionMode,
    disableSelectionMode,
    selectBucket,
    deselectBucket,
    openBucket
};

export const filesListContainerMainActions = {
    closeBucket,
    setLoading,
    enableSelectionMode,
    disableSelectionMode, 
    unsetLoading
};

