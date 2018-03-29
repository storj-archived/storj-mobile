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
    deleteBucket
};

//action creators for bucket screen
export const bucketsContainerBucketActions = {
    selectBucket,
    deselectBucket,
    createBucket
};

export const dashboardContainerBucketActions = {
    selectBucket,
    deselectBucket,
    createBucket,
    getBuckets    
}

export const initializeContainerBucketActions = {
    getBuckets
};

export const bucketsListContainerBucketActions = {
    selectBucket,
    deselectBucket
};

export const favouritesActions = {
    updateFavourite
};
