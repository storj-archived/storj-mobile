import { NativeModules } from 'react-native';

const ServiceModule = (() => {
    let instance = null;
    const serviceModule = NativeModules.ServiceModule;

    class ServiceModule {
        constructor() {
        }

        async bindService() {
            return await serviceModule.bindService();
        }

        async bindUploadService() {
            return await serviceModule.bindUploadService();
        }

        getFiles(bucketId) {
            serviceModule.getFiles(bucketId);
        }

        getBuckets() {
            serviceModule.getBuckets();
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

        scheduleSync() {
            serviceModule.scheduleSync();
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