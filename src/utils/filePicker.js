import {
    NativeModules,
    Platform
} from 'react-native'

const FilePicker = (() => {
    let instance = null;

    const filePickerLibAndroid = NativeModules.FilePickerAndroid;
    //TODO: implement file picker for iOS native module
    // const filePickerLibIos = NativeModules.FilePickerIos;
    const isAndroid = Platform.OS === 'android';

    const filePickerLib = isAndroid ? filePickerLibAndroid : {};

    class FilePicker {

        async show() {
            var options = {
                mimeType:'*/*',
                pickerTitle:'Choose file to download'
            }

            return await filePickerLib.show(options);
        }
    }

    return {
        /**
         * @returns {FilePicker}
         */
        getInstance: function() {
            if(!instance) {
                instance = new FilePicker();
            }

            return instance;
        }
    };
})();

export default FilePicker.getInstance();
