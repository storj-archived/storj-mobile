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
    HIDE_CREATE_BUCKET_INPUT
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

//action creators for main container
export const mainContainerActions = {
    getBuckets,
    showActionBar,
    hideActionBar,
    createBucket,
    deleteBucket,
    disableSelectionMode,
    showCreateBucketInput,
    hideCreateBucketInput
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
    onSingleItemSelected
};