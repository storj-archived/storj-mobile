import {
    NativeModules,
    Platform
} from 'react-native'

const OpenFileModule = (() => {
    let instance = null;

    const openFileModule = NativeModules.OpenFileModule;
    const isAndroid = Platform.OS === 'android';

    class OpenFileModule {

        openFile(fileUri) {
            if(!isAndroid) return { isSuccess: false };         

            return openFileModule.openFile(String(fileUri));
        }

        async checkFile(fileName) {
            if(!isAndroid) return { isSuccess: false };         

            let response = await openFileModule.checkFile(String(fileName));
            return response.isSuccess;
        }

        shareFile(fileUri) {
            if(!isAndroid) return { isSuccess: false };         

            return openFileModule.shareFile(String(fileUri));
        }
    }

    return {
        /**
         * @returns {OpenFileModule}
         */
        getInstance: function() {
            if(!instance) {
                instance = new OpenFileModule();
            }

            return instance;
        }
    };
})();

export default OpenFileModule.getInstance();
