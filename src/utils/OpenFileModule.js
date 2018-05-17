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
            return openFileModule.openFile(String(fileUri));
        }

        async checkFile(fileName) {
            let response = await openFileModule.checkFile(String(fileName));
            return response.isSuccess;
        }

        shareFile(fileUri) {
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
