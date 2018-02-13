import {
    NativeModules,
    Platform
} from 'react-native'

const FilePicker = (() => {
    let instance = null;

    const filePickerLibAndroid = NativeModules.FilePickerAndroid;
    const filePickerLibIos = NativeModules.FilePickerIos;
    const isAndroid = Platform.OS === 'android';

    const filePickerLib = isAndroid ? filePickerLibAndroid : filePickerLibIos;

    class FilePicker {

        async show() {
            var options = {
                mimeType:'*/*',
                pickerTitle:'Choose file to download'
            }
            let resp = await filePickerLib.show(options);

            console.log('PICKER PIDARAS ', resp);

            return resp;
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
