import { NativeModules } from 'react-native';

const ServiceModule = (() => {
    let instance = null;
    const serviceModule = NativeModules.ServiceModule;
    console.log(serviceModule);

    class ServiceModule {
        constructor() {

        }

        async bindService() {
            await serviceModule.bindService();
        }

        getBuckets() {
            serviceModule.getBuckets();
        }

        async listBuckets() {
            return await serviceModule.listBuckets();
        }

        getFiles(bucketId) {
            serviceModule.getFiles(bucketId);
        }

        async listFiles(bucketId) {
            return await serviceModule.listFiles(bucketId);
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

        async updateFileStarred(bucketId, isStarred) {
            return await serviceModule.updateFileStarred(bucketId, isStarred);
        }

        async getStarredFiles() {
            return await serviceModule.getStarredFiles(fileId);
        }

        async getStarredBuckets() {
            return await serviceModule.getStarredBuckets(fileId);
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