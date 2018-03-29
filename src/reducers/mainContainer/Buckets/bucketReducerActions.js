import { BUCKET_ACTIONS } from '../../../utils/constants/actionConstants';
import { SYNC_BUCKETS } from '../../../utils/constants/SyncBuckets';
import ServiceModule from '../../../utils/ServiceModule';

const { PICTURES } = SYNC_BUCKETS;

const { 
    SELECT_BUCKET, 
    DESELECT_BUCKET, 
    CREATE_BUCKET,
    DELETE_BUCKET,
    GET_BUCKETS, 
    OPEN_BUCKET,
    CLOSE_BUCKET,
    UPDATE_FAVOURITE
} = BUCKET_ACTIONS;

function selectBucket(bucket) {
    return { type: SELECT_BUCKET, payload: { bucket } };
}

function deselectBucket(bucket) {
    return { type: DESELECT_BUCKET, payload: { bucket } };
}
function createBucket(bucket) {
    return { type: CREATE_BUCKET, payload: { bucket } };
}

function deleteBucket(bucketId) {
    return { type: DELETE_BUCKET, payload: { bucketId } };
}

function getBuckets(buckets) {
    return { type: GET_BUCKETS, payload: { buckets } };
}

function openBucket(bucketId) {
    return { type: OPEN_BUCKET, payload: { bucketId } };
}

function closeBucket() {
    return { type: CLOSE_BUCKET };
}

function updateFavourite(buckets) {
    return { type: UPDATE_FAVOURITE, payload: { buckets } } 
}

export function getPicturesBucketId(buckets) {
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
export const mainContainerBucketActions = {
    getBuckets,    
    createBucket,
    deleteBucket,
    openBucket
};

//action creators for main screen navigation container
export const mainNavContainerBucketActions = {
    selectBucket,
    deselectBucket
};

//action creators for bucket screen
export const bucketsContainerBucketActions = {
    selectBucket,
    deselectBucket,
    createBucket,
    closeBucket
};

export const dashboardContainerBucketActions = {
    selectBucket,
    deselectBucket,
    createBucket,
    openBucket,
    getBuckets    
}

export const initializeContainerBucketActions = {
    getBuckets
};

export const bucketsListContainerBucketActions = {
    selectBucket,
    deselectBucket,
    openBucket
};

export const filesListContainerBucketActions = {
    closeBucket
};

export const myPicturesListContainerBucketActions = {
    closeBucket,
    openBucket
};

export const favouritesActions = {
    updateFavourite
};
