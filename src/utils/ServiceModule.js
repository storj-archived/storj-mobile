import { NativeModules } from 'react-native';

const ServiceModule = (() => {
    let instance = null;
    const serviceModule = NativeModules.ServiceModule;
    console.log(serviceModule);

    class ServiceModule {
        constructor() {

        }

        async bindService() {
            await serviceModule.bindService();
        }

        getBuckets() {
            serviceModule.getBuckets();
        }

        async listBuckets() {
            return await serviceModule.listBuckets();
        }
    }  

    return {
        /**
         * @returns {ServiceModule}
         */
        getInstance: function() {
            if(!instance) {
                instance = new ServiceModule();
            }

            return instance;
        }
    };

})();

export default ServiceModule.getInstance();