import { NativeModules, Platform } from 'react-native';
import { SYNC_BUCKETS } from '../utils/constants/SyncBuckets';

const { PICTURES } = SYNC_BUCKETS;

const ServiceModule = (() => {
    let instance = null;


    const isAndroid = Platform.OS === 'android';
    const serviceModule = isAndroid ? NativeModules.ServiceModule : NativeModules.ServiceModuleIOS;

    class ServiceModule {
        getServiceNativeModule(){
            return serviceModule;
        }

        constructor() {
        }

        async bindGetBucketsService() {
            return await serviceModule.bindGetBucketsService();
        }

        async bindUploadService() {
            return await serviceModule.bindUploadService();
        }

        async bindDownloadService() {
            return await serviceModule.bindDownloadService();
        }

        getFiles(bucketId) {
            serviceModule.getFiles(bucketId);
        }

        /**
         * Getting buckets from Storj Network, updates local db and gets bucket list from db
         * @param {string} sortingMode - available options - date and name
         */
        getBuckets() {
            serviceModule.getBuckets();
        }

        uploadFile(bucketId, uri) {
            serviceModule.uploadFile(String(bucketId), String(uri), null);
        }

        downloadFile(bucketId, fileId, localPath) {
            serviceModule.downloadFile(String(bucketId), String(fileId), String(localPath));
        }

        copyFile(bucketId, fileId, localPath, targetBucketId) {
            serviceModule.copyFile(String(bucketId), String(fileId), String(localPath), String(targetBucketId));
        }

        test() {
            serviceModule.test();
        }

        async createBucket(bucketName) {
            return await serviceModule.createBucket(bucketName);
        }

        async deleteBucket(bucketId) {
            return await serviceModule.deleteBucket(bucketId);
        }

        async deleteFile(bucketId, fileId) {
            return await serviceModule.deleteFile(bucketId, fileId);
        }

        /**
         * Creates base buckets if they are absent
         * @param {ListIteModel[]} buckets 
         */
        createBaseBuckets(buckets) {
            let doesExist = buckets.find(bucket => bucket.getName() === PICTURES);

            if(!doesExist) {
                this.createBucket(PICTURES);
            }
        }
    }  

    return {
        /**
         * @returns {ServiceModule}
         */
        getInstance: function() {
            if(!instance) {
                instance = new ServiceModule();
            }

            return instance;
        }
    };

})();

export default ServiceModule.getInstance();