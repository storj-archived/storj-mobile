import { NativeModules } from 'react-native';

const ServiceModule = (() => {
    let instance = null;
    const serviceModule = NativeModules.ServiceModule;

    class ServiceModule {
        constructor() {
            this.getBucketsWorking = false;
            this.getFilesWorking = false;
        }

        async bindService() {
            return await serviceModule.bindService();
        }

        async bindUploadService() {
            return await serviceModule.bindUploadService();
        }

        uploadFile(bucketId, uri) {
            serviceModule.uploadFile(bucketId, uri);
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

        async updateBucketStarred(bucketId, isStarred) {
            return await serviceModule.updateBucketStarred(bucketId, isStarred);
        }

        async updateFileStarred(bucketId, fileId, isStarred) {
            return await serviceModule.updateFileStarred(bucketId, fileId, isStarred);
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