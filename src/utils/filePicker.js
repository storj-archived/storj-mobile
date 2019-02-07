import {
    NativeModules
} from 'react-native'

const FilePicker = (() => {
    let instance = null;

    const filePickerLibAndroid = NativeModules.FilePickerAndroid;
    const imagePickerLibIos = NativeModules.FilePickerIos;
    const documentsPickerModule = NativeModules.DocumentsPickerModule;

    class FilePicker {

        async show(type) {
            var options = {
                mimeType:'*/*',
                pickerTitle:'Choose file to download'
            };

            var filePickerLib = null;

            switch(type) {
                case "image":
                    filePickerLib = imagePickerLibIos;
                    break;
                case "document":
                    filePickerLib = documentsPickerModule;
                    break;
                default:
                    filePickerLib = filePickerLibAndroid;
                    break;
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
