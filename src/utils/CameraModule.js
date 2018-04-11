import { NativeModules } from 'react-native';

const cameraModule = (() => {
    let instance = null;
    const cameraModule = NativeModules.CameraModule;

    class CameraModule {
        constructor() {

        }

        openCamera(bucketId) {
            cameraModule.openCamera(String(bucketId));
        }
    }

    return {
        getInstance: function() {
            if(!instance) {
                instance = new CameraModule();
            }

            return instance; 
        }
    };
})();

export default cameraModule.getInstance();