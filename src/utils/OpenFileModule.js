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

        checkFile(fileName) {
            if(!isAndroid) return { isSuccess: false };         

            return openFileModule.checkFile(String(fileName));
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
