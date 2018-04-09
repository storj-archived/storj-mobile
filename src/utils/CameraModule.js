import { NativeModules } from 'react-native';

const cameraModule = (() => {
    let instance = null;
    const cameraModule = NativeModules.CameraModule;

    class CameraModule {
        constructor() {

        }

        openCamera() {
            cameraModule.openCamera();
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