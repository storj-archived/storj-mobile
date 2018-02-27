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
    const isAndroid = Platform.OS === 'android';

    const storjLib = isAndroid ? storjLibAndroid : {};

    /**
     * This module wraps Native Modules for StorjLib.
     * Will be rafactored after iteration 2.
     * We should implement more functionality to have more deep understanding of needed arcitecture
     */
    class StorjModule {
        /**
         * Generate mnemonic
         * @returns {Promise<boolean>}
         */
        async generateMnemonic() {
            try {
                return await storjLib.generateMnemonic();
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
            let checkMnemonicResponse = await storjLib.checkMnemonic(mnemonic);
            return checkMnemonicResponse.isSuccess;
        };
    
        /**
         * Send new registration request
         * @param {string} email 
         * @param {string} password 
         * @param {function} sucessCallback Callback that is called on Success, returns email address from the request
         * @param {function} errorCallback Callback for error handeling, returns error message
         */
        async register(email, password, errorCallback) {
            try {
                return await storjLib.register(email, password);
            } catch(e) {
                errorCallback(e);
            }
        };
    
        /**
         * Verify if user exist in storj network
         * @param {string} email 
         * @param {string} password 
         * @returns {Promise<boolean>}
         */
        async verifyKeys(email, password) {            
            let verifyKeysPesponse = await storjLib.verifyKeys(email, password);
            return verifyKeysPesponse.isSuccess;
        };
    
        /**
         * Check if auth file allready exist on the device
         * @returns {Promise<boolean>}
         */
        async keysExists() {   
            let keysExistsReponse = await storjLib.keysExists();
            return keysExistsReponse.isSuccess;
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
            let importKeysResponse = await storjLib.importKeys(email, password, mnemonic, /*passcode*/"");
            return importKeysResponse.isSuccess;
        };
    
        /**
         * 
         * @param {string} passcode needed if user has protected your auth file with additional password
         */
        async getKeys(passcode) {
            let getKeysResponse = await storjLib.getKeys(/*passcode*/"");

            if(!getKeysResponse.isSuccess) {
                //TODO: add some error handling logic here
            }

            return getKeysResponse;
        };
    
        /**
         * List buckets for logged in user
         * @returns {Promise<BucketModel[]>}
         */
        async getBuckets() {
            let result = [];
            let bucketResponse = await storjLib.getBuckets();

            if(!bucketResponse.isSuccess) return result;

            result = JSON.parse(bucketResponse.result).map((bucket) => {
                return new BucketModel(bucket);
            });

            return result;
        }

        /**
         * Deletes bucket by Id
         * @param {string} bucketId 
         */
        async deleteBucket(bucketId) {
            return await storjLib.deleteBucket(bucketId);
        }

        /**
         * download file to storj network
         * @returns {Promise<any>}
         */
        async downloadFile(bucketId, fileId, localPath) {
            let downloadFileResult = await storjLib.downloadFile(bucketId, fileId, localPath);

            return downloadFileResult;
        }

        /**
         * download file to storj network
         * @returns {Promise<any>}
         */
         async uploadFile(bucketId, localPath) {
            let uploadFileResult = await storjLib.uploadFile(bucketId, localPath);

            if(uploadFileResult.isSuccess) {
                uploadFileResult.result = new FileModel(JSON.parse(uploadFileResult.result));
            }

            return uploadFileResult;
        };

        /**
         * List buckets for logged in user
         * @returns {Promise<FileModel[]>}
         */
        async listFiles(bucketId) {
            let listFilesResult = await storjLib.listFiles(bucketId);

            if(listFilesResult.isSuccess) {
                listFilesResult.result = JSON.parse(listFilesResult.result).map(file => {
                    return new FileModel(file);
                });      
            } 

            return listFilesResult;
        };
    
        /**
         * Create bucket
         * @returns {Promise<BucketModel>}
         */
        async createBucket(bucketName) {
            let createBucketResponse = await storjLib.createBucket(bucketName);
            
            if(createBucketResponse.isSuccess) {
                createBucketResponse.result = new BucketModel(JSON.parse(createBucketResponse.result));
            }

            return createBucketResponse;         
        };

        /**
         * 
         * @param {string} bucketId 
         * @param {string} fileId 
         */
        async deleteFile(bucketId, fileId) {
            return await storjLib.deleteFile(bucketId, fileId);
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


