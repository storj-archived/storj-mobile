import { NativeModules, Platform } from 'react-native';

const SyncModule = (() => {
    let instance = null;
    const syncModule = Platform.OS ==="android" ? NativeModules.SyncModule : NativeModules.SyncModuleIOS;

    class SyncModule {
        constructor() {

        }

        async listBuckets(sortingMode = "date") {
            return await syncModule.listBuckets(String(sortingMode));
        }

        async listFiles(bucketId, sortingMode) {
            return await syncModule.listFiles(bucketId, sortingMode);
        }

        async listAllFiles(sortingMode) {
            return await syncModule.listAllFiles(sortingMode);
        }

        async listUploadingFiles(bucketId) {
            return await syncModule.listUploadingFiles(bucketId);
        }

        async getUploadingFile(fileHandle) {
            return await syncModule.getUploadingFile(String(fileHandle));
        }

        async getFile(fileId) {
            return await syncModule.getFile(fileId);
        }

        async updateBucketStarred(bucketId, isStarred) {
            return await syncModule.updateBucketStarred(bucketId, isStarred);
        }

        async updateFileStarred(fileId, isStarred) {
            return await syncModule.updateFileStarred(fileId, isStarred);
        }

        async listSettings(settingsId) {
            return await syncModule.listSettings(String(settingsId));
        }

        async insertSyncSetting(settingsId) {
            return await syncModule.insertSyncSetting(String(settingsId));
        }
        
        async updateSyncSettings(settingsId, syncSettings) {
            return await syncModule.updateSyncSettings(String(settingsId), Number(syncSettings));
        }

        async setFirstSignIn(settingsId, syncSettings) {
            return await syncModule.setFirstSignIn(String(settingsId), Number(syncSettings));
        }

        async changeSyncStatus(settingsId, value) {
            return await syncModule.changeSyncStatus(String(settingsId), Boolean(value));
        }

        async checkImage(fileId, localPath) {
            return await syncModule.checkImage(String(fileId), String(localPath));
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