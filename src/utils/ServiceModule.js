import { NativeModules } from 'react-native';

const ServiceModule = (() => {
    let instance = null;
    const serviceModule = NativeModules.ServiceModule;

    class ServiceModule {
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

        getBuckets() {
            serviceModule.getBuckets();
        }

        uploadFile(bucketId, uri) {
            serviceModule.uploadFile(String(bucketId), String(uri));
        }

        downloadFile(bucketId, fileId, localPath) {
            serviceModule.downloadFile(String(bucketId), String(fileId), String(localPath));
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
            let doesExist = buckets.find(bucket => bucket.getName() === 'Pictures');

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