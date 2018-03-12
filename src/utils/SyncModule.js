import { NativeModules } from 'react-native';

const SyncModule = (() => {
    let instance = null;
    const syncModule = NativeModules.SyncModule;
    console.log(syncModule);

    class SyncModule {
        constructor() {

        }

        async listBuckets() {
            return await syncModule.listBuckets();
        }

        async listFiles(bucketId) {
            return await syncModule.listFiles(bucketId);
        }

        async listUploadingFiles(bucketId) {
            return await syncModule.listUploadingFiles(bucketId);
        }

        async getUploadingFile(fileHandle) {
            console.log(String(fileHandle));
            return await syncModule.getUploadingFile(String(fileHandle));
        }

        async getFile(fileId) {
            return await syncModule.getFile(fileId);
        }
    }  

    return {
        /**
         * @returns {SyncModule}
         */
        getInstance: function() {
            if(!instance) {
                instance = new SyncModule();
            }

            return instance;
        }
    };

})();

export default SyncModule.getInstance();