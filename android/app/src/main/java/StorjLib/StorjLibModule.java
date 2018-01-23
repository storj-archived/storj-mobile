package StorjLib;



import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import io.storj.libstorj.Bucket;
import io.storj.libstorj.CreateBucketCallback;
import io.storj.libstorj.GetBucketsCallback;
import io.storj.libstorj.Keys;
import io.storj.libstorj.KeysNotFoundException;
import io.storj.libstorj.RegisterCallback;
import io.storj.libstorj.Storj;
import io.storj.libstorj.android.StorjAndroid;

//TODO: 1. validate all input parameters (check in sources)
//TODO: split StorjLibModule into several modules to prevent God object creating

public class StorjLibModule extends ReactContextBaseJavaModule {

    private static final String E_VERIFY_KEYS = "STORJ_E_VERIFY_KEYS";
    private static final String E_IMPORT_KEYS = "E_IMPORT_KEYS";
    private static final String E_KEYS_EXISTS = "E_KEYS_EXISTS";
    private static final String E_GET_KEYS = "E_GET_KEYS";
    private static final String E_REGISTER = "E_REGISTER";
    private static final String E_GENERATE_MNEMONIC = "STORJ_E_GENERATE_MNEMONIC";
    private static final String E_CHECK_MNEMONIC = "E_CHECK_MNEMONIC";
    private static final String E_KEYS_NOT_FOUND = "E_KEYS_NOT_FOUND";
    private static final String E_GET_BUCKETS = "E_GET_BUCKETS";
    private static final String E_CREATE_BUCKET = "E_CREATE_BUCKET";
    private static final String MODULE_NAME = "StorjLibAndroid";

    public StorjLibModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod @Deprecated
    public void generateMnemonic(Promise promise) {
        try {
            String result = Storj.generateMnemonic(256);

            promise.resolve(result);
        } catch(Exception e) {
            promise.reject(E_GENERATE_MNEMONIC, e);
        }
    }

    @ReactMethod
    public void checkMnemonic(String mnemonic, Promise promise) {
        try {
            promise.resolve(Storj.checkMnemonic(mnemonic));
        } catch(Exception e){
            promise.reject(E_CHECK_MNEMONIC, e);
        }
    }

    @ReactMethod
    public void verifyKeys(final String email, final String password, final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    boolean result = StorjAndroid.getInstance(getReactApplicationContext()).verifyKeys(email, password);

                    promise.resolve(result);
                } catch(Exception e) {
                    promise.reject(E_VERIFY_KEYS, e);
                }
            }
        }).run();
    }

    @ReactMethod
    public void keysExists(Promise promise) {
        try {
            boolean result = StorjAndroid.getInstance(getReactApplicationContext()).keysExist();

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(E_KEYS_EXISTS, e);
        }
    };

    @ReactMethod
    public void importKeys(String email, String password, String mnemonic, String passcode, Promise promise) {
        try {
            boolean result = StorjAndroid.getInstance(getReactApplicationContext()).importKeys(new Keys(email, password, mnemonic), passcode);

            promise.resolve(result);
        } catch(Exception e) {
            promise.reject(E_IMPORT_KEYS, e);
        }
    }

    @ReactMethod
    public void getKeys(String passcode, Callback succesCallback, Callback errorCallback) {
        try {
            Keys keys = StorjAndroid.getInstance(getReactApplicationContext()).getKeys(passcode);

            WritableMap map = Arguments.createMap();

            map.putString("email", keys.getUser());
            map.putString("password", keys.getPass());
            map.putString("mnemonic", keys.getMnemonic());

            succesCallback.invoke(map);
        } catch(Exception e) {
            errorCallback.invoke(E_GET_KEYS);
        }
    }

    @ReactMethod
    public void register(final String login, final String password, final Promise promise) {
        new Thread(new Runnable() {
            public void run() {
            try {
                StorjAndroid.getInstance(getReactApplicationContext()).register(login, password, new RegisterCallbackWrapper(promise));
                } catch(Exception e) {
                    promise.reject(E_REGISTER, e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void createBucket(final String bucketName, final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    StorjAndroid.getInstance(getReactApplicationContext()).createBucket(bucketName, new CreateBucketCallbackWrapper(promise));
                } catch(Exception e) {
                    promise.reject(E_CREATE_BUCKET, e);
                }
            }
        }).run();
    }

    @ReactMethod
    public void getBuckets(Promise promise) {
        try {
            StorjAndroid.getInstance(getReactApplicationContext()).getBuckets(new GetBucketsCallbackWrapper(promise));
        } catch (KeysNotFoundException e)  {
            promise.reject(E_KEYS_NOT_FOUND, e);
        } catch (Exception e) {
            promise.reject(E_GET_BUCKETS, e);
        }
    }

    private class CreateBucketCallbackWrapper implements CreateBucketCallback {

        private Promise _promise;
        private WritableMap map;

        public CreateBucketCallbackWrapper(Promise promise) {
            _promise = promise;
            map = Arguments.createMap();
        }

        @Override
        public void onError(final String message) {
            map.putBoolean("isSuccess", false);
            map.putMap("bucket", null);
            map.putString("errorMessage", message);

            _promise.resolve(map);
        }

        @Override
        public  void onBucketCreated(Bucket bucket) {
            WritableMap bucketJs = Arguments.createMap();

            bucketJs.putString("id", bucket.getId());
            bucketJs.putString("name", bucket.getName());
            bucketJs.putString("created", bucket.getCreated());
            bucketJs.putInt("hash", bucket.hashCode());
            bucketJs.putBoolean("isDecrypted", bucket.isDecrypted());

            map.putBoolean("isSuccess", true);
            map.putMap("bucket", bucketJs);
            map.putString("errorMessage", null);

            _promise.resolve(map);
        }
    }

    private class RegisterCallbackWrapper implements RegisterCallback {

        private Promise _promise;
        private WritableMap map;

        public RegisterCallbackWrapper(Promise promise) {
            _promise = promise;
            map = Arguments.createMap();
        }

        @Override
        public void onConfirmationPending(final String email) {
            RegisterResponse response = new RegisterResponse(
                    true,
                    StorjAndroid.getInstance(getReactApplicationContext()).generateMnemonic(256),
                    null);

            map.putBoolean("isSuccess", response.getResult());
            map.putString("mnemonic", response.getMnemonic());
            map.putString("errorMessage", response.getErrorMessage());

            _promise.resolve(map);
        }

        @Override
        public void onError(final String message) {
            RegisterResponse response = new RegisterResponse(
                    false,
                    null,
                    message);

            map.putBoolean("isSuccess", response.getResult());
            map.putString("mnemonic", response.getMnemonic());
            map.putString("errorMessage", response.getErrorMessage());

            _promise.resolve(map);
        }
    }

    private class RegisterResponse {

        private Boolean _isSuccess = false;
        private String _mnemonic = null;
        private String _errorMessage = null;

        public RegisterResponse(Boolean isSuccess, String mnemonic, String errorMessage) {
            _isSuccess = isSuccess;
            _mnemonic = mnemonic;
            _errorMessage = errorMessage;
        }

        public Boolean getResult() {
            return _isSuccess;
        }

        public String getMnemonic() {
            return _mnemonic;
        }

        public String getErrorMessage() {
            return _errorMessage;
        }
    }

    private class GetBucketsCallbackWrapper implements GetBucketsCallback {

        private Promise _promise;

        public GetBucketsCallbackWrapper(Promise promise) {
            _promise = promise;
        }

        @Override
        public void onBucketsReceived(Bucket[] buckets) {
            WritableArray array = Arguments.createArray();

            for (Bucket buck: buckets) {
                WritableMap map = Arguments.createMap();

                map.putString("id", buck.getId());
                map.putString("name", buck.getName());
                map.putString("created", buck.getCreated());
                map.putInt("hash", buck.hashCode());
                map.putBoolean("isDecrypted", buck.isDecrypted());

                array.pushMap(map);
            }

            _promise.resolve(array);
        }

        @Override
        public void onError(final String message) {
            _promise.reject(E_GET_BUCKETS ,message);
        }
    }
}
