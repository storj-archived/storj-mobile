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
    DISABLE_SELECTION_MODE 
} = MAIN_ACTIONS;

function selectBucket(bucket) {
    return { type: SELECT_BUCKET, payload: { bucket } };
};

function deselectBucket(bucket) {
    return { type: DESELECT_BUCKET, payload: { bucket } };
};

function createBucket(bucket) {
    return { type: CREATE_BUCKET, payload: { bucket } };
};

function deleteBucket(bucket) {
    return { type: DELETE_BUCKET, payload: { bucket } };
};

function getBuckets(buckets) {
    return { type: GET_BUCKETS, payload: { buckets } };
};

function showActionBar() {
    return { type: SHOW_ACTION_BAR };
};

function hideActionBar() {
    return { type: HIDE_ACTION_BAR };
};

function enableSelectionMode() {
    return { type: ENABLE_SELECTION_MODE };
};

function disableSelectionMode() {
    return { type: DISABLE_SELECTION_MODE };
};

//action creators for main container
export const mainContainerActions = {
    getBuckets,
    showActionBar,
    hideActionBar,
    createBucket,
    deleteBucket,
    disableSelectionMode
};

//action creators for main screen navigation container
export const mainNavContainerActions = {
    selectBucket,
    deselectBucket,
    enableSelectionMode
};