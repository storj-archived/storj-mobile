import {
    NativeModules,
    Platform
} from 'react-native'
import BucketModel from '../models/BucketModel';
import FileModel from '../models//FileModel';
import keysModel from '../models/keysModel';

//TODO: StorjModule wil send us only Response objects, 
// so all try/catch blocks should be removed and all error logic should be after checking !isSuccess
const StorjLib = (() => {
    let instance = null;

    const storjLibAndroid = NativeModules.StorjLibAndroid;
    const storjLibIos = NativeModules.StorjLibIos;
    const isAndroid = Platform.OS === 'android';

    const storjLib = isAndroid ? storjLibAndroid : storjLibIos;

    /**
     * This module wraps Native Modules for StorjLib.
     * Will be rafactored after iteration 2.
     * We should implement more functionality to have more deep understanding of needed arcitecture
     */
    class StorjModule {

        getStorjLibNativeModule(){
            return storjLib;
        }

        /**
         * Generate mnemonic
         * @returns {Promise<boolean>}
         */
        async generateMnemonic() {
            try {
                let response = await storjLib.generateMnemonic();

                if(!response.isSuccess){
                    console.log('generateMnemonic ', response.error.message);
                }

                return response;
            } catch(e) {
                console.log(e);
            }
        }

        /**
         * Check if mnemonic provided has valid format
         * @param {string} mnemonic
         * @returns {Promise<boolean>} 
         */
        async checkMnemonic(mnemonic) {    
            let response = await storjLib.checkMnemonic(mnemonic);

            if(!response.isSuccess){
                console.log('checkMnemonic ', response.error.message);
            }

            return response.isSuccess;
        };
    
        /**
         * Send new registration request
         * @param {string} email 
         * @param {string} password 
         * @param {function} sucessCallback Callback that is called on Success, returns email address from the request
         * @param {function} errorCallback Callback for error handeling, returns error message
         */
        async register(email, password, errorCallback) {
            let response = await storjLib.register(email, password);

            if(!response.isSuccess){
                console.log('register ', response.error.message);
            }

            return response;
        };
    
        /**
         * Verify if user exist in storj network
         * @param {string} email 
         * @param {string} password 
         * @returns {Promise<boolean>}
         */
        async verifyKeys(email, password) {            
            let response = await storjLib.verifyKeys(email, password);

            if(!response.isSuccess){
                console.log('verifyKeys ', response.error.message);
            }

            return response.isSuccess;
        };
    
        /**
         * Check if auth file allready exist on the device
         * @returns {Promise<boolean>}
         */
        async keysExists() {   
            let response = await storjLib.keysExists();

            if(!response.isSuccess){
                console.log('keysExists ', response.error.message);
            }

            return response.isSuccess;
        };
    
        /**
         * Creates new auth file for given credentials and stores it on the device
         * and saves them in the current context
         * @param {string} email 
         * @param {string} password 
         * @param {string} mnemonic 
         * @param {string} passcode optional, pass if you want to protect auth file with additional password
         * @returns {Promise<boolean>}
         */
        async importKeys(email, password, mnemonic, passcode) {            
            let response = await storjLib.importKeys(email, password, mnemonic, /*passcode*/"");

            if(!response.isSuccess){
                console.log('importKeys ', response.error.message);
            }

            return response.isSuccess;
        };
    
        /**
         * 
         * @param {string} passcode needed if user has protected your auth file with additional password
         */
        async getKeys(passcode) {
            let response = await storjLib.getKeys(/*passcode*/"");

            if(!response.isSuccess) {
                console.log('getKeys ', response.error.message);
            }

            return response;
        };
    
        /**
         * List buckets for logged in user
         * @returns {Promise<BucketModel[]>}
         */
        async getBuckets() {
            let result = [];
            let response = await storjLib.getBuckets();

            if(!response.isSuccess) {
                console.log('getBuckets ', response.error.message);
                return result;
            }

            result = JSON.parse(response.result).map((bucket) => {
                return new BucketModel(bucket);
            });

            return result;
        }

        /**
         * Deletes bucket by Id
         * @param {string} bucketId 
         */
        async deleteBucket(bucketId) {
            let response = await storjLib.deleteBucket(bucketId);

            if(!response.isSuccess) {
                console.log('deleteBucket ', response.error.message);
            }

            return response;
        }

        /**
         * download file to storj network
         * @returns {Promise<any>}
         */
        async downloadFile(bucketId, fileId, localPath) {
            let response = await storjLib.downloadFile(bucketId, fileId, localPath);

            if(!response.isSuccess) {
                console.log('downloadFile ', response.error.message);
            }

            return response;
        }

        /**
         * cancel file downloading
         * @returns {Promise<any>}
         */
        async cancelDownload(fileRef) {
            let response = await storjLib.cancelDownload(fileRef);

            if(!response.isSuccess) {
                console.log('cancelDownload ', response.error.message);
            }

            return response;
        }

        /**
         * cancel file uploading
         * @returns {Promise<any>}
         */
        async cancelUpload(fileRef) {
            let response = await storjLib.cancelUpload(fileRef);

            if(!response.isSuccess) {
                console.log('cancelUpload ', response.error.message);
            }

            return response;
        }

        /**
         * download file to storj network
         * @returns {Promise<any>}
         */
         async uploadFile(bucketId, localPath) {
            let response = await storjLib.uploadFile(bucketId, localPath);

            if(response.isSuccess) {
                response.result = new FileModel(JSON.parse(response.result));
            } else {
                console.log('uploadFile ', response.error.message);
            }

            return response;
        };

        /**
         * List buckets for logged in user
         * @returns {Promise<FileModel[]>}
         */
        async listFiles(bucketId) {
            let response = await storjLib.listFiles(bucketId);

            if(response.isSuccess) {
                response.result = JSON.parse(response.result).map(file => {
                    return new FileModel(file);
                });      
            } else {
                console.log('listFiles ', response.error.message);
            }

            return response;
        };
    
        /**
         * Create bucket
         * @returns {Promise<BucketModel>}
         */
        async createBucket(bucketName) {
            let response = await storjLib.createBucket(bucketName);
            
            if(response.isSuccess) {
                response.result = new BucketModel(JSON.parse(response.result));
            } else {
                console.log('createBucket ', response.error.message);
            }

            return response;         
        };

        /**
         * 
         * @param {string} bucketId 
         * @param {string} fileId 
         */
        async deleteFile(bucketId, fileId) {
            let response = await storjLib.deleteFile(bucketId, fileId);

            if(!response.isSuccess) {
                console.log('deleteFile ', response.error.message);
            } 

            return response;
        }
    }

    return {
        /**
        * @returns {StorjModule}
        */
        getInstance: function() {
            if(!instance) {
                instance = new StorjModule();
            }

            return instance;
        }
    };
})();

export default StorjLib.getInstance();


