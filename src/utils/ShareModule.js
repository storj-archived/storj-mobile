import {
    NativeModules,
    Platform
} from 'react-native'

const ShareModule = (() => {
    let instance = null;

    const shareModuleAndroid = NativeModules.ShareModuleAndroid;
    const shareModuleIos = NativeModules.ShareModuleIos;
    const isAndroid = Platform.OS === 'android';

    const shareModule = isAndroid ? shareModuleAndroid : shareModuleIos;

    class ShareModule {
        async shareFile(fileUri) {
            console.log("Sharing file. Uri: ", fileUri);
            let response = await shareModule.shareFile(fileUri);

            if(!response.isSuccess) {
                console.log("Error.Share file: ", response.error.message);
            }

            return response;
        }
    }

    return {

        /**
         *
         * @returns {ShareModule} instance
         */
        getInstance: function () {
            if(!instance) {
                instance = new ShareModule();

                return instance;
            }
        }
    }

})();

export default ShareModule.getInstance();