import { NativeModules,
    Platform } from 'react-native';

const cameraModule = (() => {
    let instance = null;
    const cameraModuleAndroid = NativeModules.CameraModule;
    const cameraModuleIos = NativeModules.CameraModuleIos;
    const cameraModule = Platform.OS === 'android' ? cameraModuleAndroid : cameraModuleIos;

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