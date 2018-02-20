package StorjLib;

import android.net.Uri;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import StorjLib.CallbackWrappers.CreateBucketCallbackWrapper;
import StorjLib.Responses.Response;
import StorjLib.Responses.SingleResponse;
import StorjLib.StorjTypesWrappers.BucketWrapper;
import StorjLib.Utils.FileUtils;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.DeleteBucketCallback;
import io.storj.libstorj.DeleteFileCallback;
import io.storj.libstorj.DownloadFileCallback;
import io.storj.libstorj.File;
import io.storj.libstorj.GetBucketsCallback;
import io.storj.libstorj.Keys;
import io.storj.libstorj.KeysNotFoundException;
import io.storj.libstorj.ListFilesCallback;
import io.storj.libstorj.RegisterCallback;
import io.storj.libstorj.Storj;
import io.storj.libstorj.UploadFileCallback;
import io.storj.libstorj.android.StorjAndroid;

//TODO: 1. validate all input parameters (check in sources)
//TODO: split StorjLibModule into several modules to prevent God object creating



interface IMethodParams {
    Promise getPromise();
}

class BaseMethodParams implements IMethodParams {
    private Promise _promise;

    BaseMethodParams(Promise promise) {
        _promise = promise;
    }

    public Promise getPromise() {
        return _promise;
    }
}

interface ICallback {
    void callback(IMethodParams param);
}

class MethodResult  {
    public void invoke(final IMethodParams param, final ICallback callback) {
        try {
            if(callback == null) return;

            callback.callback(param);
        }
        catch(Exception error) {

        }
    }

    public void invokeParallel(final IMethodParams param, final ICallback callback) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    if(callback == null) return;

                    callback.callback(param);
                }
                catch(Exception error) {

                }
            }
        }).start();
    }
}

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

        public Storj getStorj() {
            return StorjAndroid.getInstance(getReactApplicationContext());
        }

        @ReactMethod
        @Deprecated
        public void generateMnemonic(Promise promise) {
            ICallback callback = new ICallback() {
                @Override
                public void callback(IMethodParams param) {
                    String result = Storj.generateMnemonic(256);

                    param.getPromise().resolve(
                            result != null && !result.isEmpty()
                                ? new SingleResponse<>(true, result, null)
                                : new SingleResponse<String>(false, null, "Unable to generate mnemonic"));
                }
            };

            new MethodResult().invoke(new BaseMethodParams(promise), callback);
    }


    @ReactMethod
    public void checkMnemonic(final String mnemonic, Promise promise) {
        ICallback callback = new ICallback() {
            @Override
            public void callback(IMethodParams param) {

                param.getPromise().resolve(
                        Storj.checkMnemonic(mnemonic)
                                ? new Response(true, null)
                                : new Response(false, E_CHECK_MNEMONIC));
            }
        };

        new MethodResult().invoke(new BaseMethodParams(promise), callback);
    }

    @ReactMethod
    public void verifyKeys(final String email, final String password, final Promise promise) {
        ICallback callback = new ICallback() {
            @Override
            public void callback(IMethodParams param) {
                try {
                    int error_code = getStorj().verifyKeys(email, password);

                    param.getPromise().resolve(
                            error_code == 0
                                    ? new Response(true, null)
                                    : new Response(false, E_VERIFY_KEYS));

                } catch (Exception e) {
                    promise.reject(E_VERIFY_KEYS, e);
                }
            }
        };

        new MethodResult().invokeParallel(new BaseMethodParams(promise), callback);
    }

    @ReactMethod
    public void keysExists(Promise promise) {
        try {
            boolean result = StorjAndroid.getInstance(getReactApplicationContext()).keysExist();

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(E_KEYS_EXISTS, e);
        }
    }

    @ReactMethod
    public void importKeys(String email, String password, String mnemonic, String passcode, Promise promise) {
        try {
            boolean result = StorjAndroid.getInstance(getReactApplicationContext()).importKeys(new Keys(email, password, mnemonic), passcode);

            promise.resolve(result);
        } catch (Exception e) {
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
        } catch (Exception e) {
            errorCallback.invoke(E_GET_KEYS);
        }
    }

    @ReactMethod
    public void register(final String login, final String password, final Promise promise) {
        new Thread(new Runnable() {
            public void run() {
                try {
                    StorjAndroid.getInstance(getReactApplicationContext()).register(login, password, new RegisterCallbackWrapper(promise));
                } catch (Exception e) {
                    promise.reject(E_REGISTER, e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void createBucket(final String bucketName, final Promise promise) {
        ICallback callback = new ICallback() {
            @Override
            public void callback(IMethodParams param) {
                StorjAndroid.getInstance(getReactApplicationContext()).createBucket(bucketName, new CreateBucketCallbackWrapper(promise));
            }
        };

        new MethodResult().invokeParallel(new BaseMethodParams(promise), callback);
    }

    @ReactMethod
    void deleteBucket(final String bucketId, final Promise promise) {

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    StorjAndroid.getInstance(getReactApplicationContext()).deleteBucket(bucketId, new DeleteCallbackWrapper(promise, bucketId));
                } catch (Exception e) {
                    promise.resolve(new SingleResponse<String>(true, null, "Error message"));
                }
            }
        }).start();
    }

    @ReactMethod
    public void getBuckets(final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    StorjAndroid.getInstance(getReactApplicationContext()).getBuckets(new GetBucketsCallbackWrapper(promise));
                } catch (KeysNotFoundException e) {
                    promise.reject(E_KEYS_NOT_FOUND, e);
                } catch (Exception e) {
                    promise.reject(E_GET_BUCKETS, e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void downloadFile(final String bucketId,
                      final String fileId,
                      final String localPath,
                      final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                StorjAndroid.getInstance(getReactApplicationContext()).downloadFile(bucketId, fileId, localPath, new DownloadFileCallback() {
                    @Override
                    public void onProgress(String fileId, double progress, long downloadedBytes, long totalBytes) {
                        //onProgressCallback.invoke(fileId, progress, downloadedBytes, totalBytes);
                        WritableMap map = new WritableNativeMap();

                        map.putString("bucketId", bucketId);
                        map.putString("fileId", fileId);
                        map.putDouble("progress", progress);
                        map.putDouble("downloadedBytes", downloadedBytes);
                        map.putDouble("totalBytes", totalBytes);

                        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("downloadFile", map);
                    }

                    @Override
                    public void onComplete(String fileId, String localPath) {
                        WritableMap response = new WritableNativeMap();

                        response.putBoolean("isSuccess", true);
                        response.putString("errorMessage", null);

                        WritableMap result = new WritableNativeMap();

                        result.putString("fileId", fileId);
                        result.putString("localPath", localPath);

                        response.putMap("result", result);

                        promise.resolve(response);
                    }

                    @Override
                    public void onError(String fileId, int code, String message) {
                        WritableMap response = new WritableNativeMap();

                        response.putBoolean("isSuccess", false);
                        response.putString("errorMessage", message);

                        WritableMap result = new WritableNativeMap();

                        result.putString("bucketId", bucketId);
                        result.putString("fileId", fileId);
                        result.putString("localPath", null);

                        response.putMap("result", result);

                        promise.resolve(response);
                    }
                });
            }
        }).start();
    }

    @ReactMethod
    public void uploadFile(final String bucketId,
                    final String localPath,
                    final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                StorjAndroid.getInstance(getReactApplicationContext()).uploadFile(bucketId, localPath, new UploadFileCallback() {
                    @Override
                    public void onProgress(String filePath, double progress, long uploadedBytes, long totalBytes) {
                        WritableMap map = new WritableNativeMap();

                        map.putString("bucketId", bucketId);
                        map.putString("filePath", filePath);
                        map.putDouble("progress", progress);
                        map.putDouble("uploadedBytes", uploadedBytes);
                        map.putDouble("totalBytes", totalBytes);

                        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("uploadFile", map);
                    }

                    @Override
                    public void onComplete(String filePath, File file) {
                        if(promise == null)
                            return;

                        WritableMap response = new WritableNativeMap();

                        response.putBoolean("isSuccess", true);
                        response.putString("errorMessage", null);

                        WritableMap result = new WritableNativeMap();

                        result.putString("bucketId", bucketId);
                        result.putDouble("size", file.getSize());
                        result.putString("name", file.getName());
                        result.putString("mimeType", file.getMimeType());
                        result.putString("index", file.getIndex());
                        result.putString("fileId", file.getId());
                        result.putString("hmac", file.getHMAC());
                        result.putString("erasure", file.getErasure());
                        result.putString("created", file.getCreated());

                        response.putMap("result", result);

                        promise.resolve(response);
                    }

                    @Override
                    public void onError(String filePath, int code, String message) {
                        if(promise == null)
                            return;

                        WritableMap response = new WritableNativeMap();

                        response.putBoolean("isSuccess", false);
                        response.putString("errorMessage", message);

                        WritableMap result = new WritableNativeMap();
                        result.putString("filePath", filePath);
                        result.putString("bucketId", bucketId);

                        response.putMap("result", result);

                        promise.resolve(response);
                    }
                });
            }
        }).start();
    }

    @ReactMethod
    public void deleteFile(final String bucketId, final String fileId, final Promise promise) {
        if(bucketId == null || fileId == null)
            return;

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    StorjAndroid.getInstance(getReactApplicationContext()).deleteFile(bucketId, fileId, new DeleteFileCallback() {
                        @Override
                        public void onFileDeleted() {
                            WritableMap response = new WritableNativeMap();

                            response.putBoolean("isSuccess", true);
                            response.putString("errorMessage", null);

                            WritableMap result = new WritableNativeMap();
                            result.putString("fileId", fileId);
                            result.putString("bucketId", bucketId);

                            response.putMap("result", result);

                            if(promise != null)
                                promise.resolve(response);
                        }

                        @Override
                        public void onError(int code, String message) {
                            WritableMap response = new WritableNativeMap();

                            response.putBoolean("isSuccess", false);
                            response.putString("errorMessage", message);
                            response.putMap("result", null);

                            if(promise != null)
                                promise.resolve(response);
                        }
                    });
                } catch(Exception e) {
                    WritableMap response = new WritableNativeMap();

                    response.putBoolean("isSuccess", false);
                    response.putString("errorMEssage", e.getMessage());
                    response.putMap("result", null);

                    if(promise != null)
                        promise.resolve(response);
                }
            }
        }).start();
    }

    @ReactMethod
    public void listFiles(final String bucketId, final Promise promise) {

        if(bucketId == null) {
            WritableMap result = Arguments.createMap();

            result.putBoolean("isSuccess", false);
            result.putString("errorMessage", "Invalid bucketId");
            result.putNull("result");

            promise.resolve(result);
            return;
        }

         new Thread(new Runnable() {
             @Override
             public void run() {
                 StorjAndroid.getInstance(getReactApplicationContext()).listFiles(bucketId, new ListFilesCallback() {
                     @Override
                     public void onFilesReceived(File[] files) {
                         WritableMap result = Arguments.createMap();

                         result.putBoolean("isSuccess", true);
                         result.putString("errorMessage", null);

                         WritableArray array = Arguments.createArray();

                         for (File file: files) {
                             WritableMap fileJs = new WritableNativeMap();

                             fileJs.putString("bucketId", file.getBucketId());
                             fileJs.putString("created", file.getCreated());
                             fileJs.putString("erasure", file.getErasure());
                             fileJs.putString("hmac", file.getHMAC());
                             fileJs.putString("fileId", file.getId());
                             fileJs.putString("index", file.getIndex());
                             fileJs.putString("mimeType", file.getMimeType());
                             fileJs.putString("name", file.getName());
                             fileJs.putDouble("size", file.getSize());

                             array.pushMap(fileJs);
                         }

                         result.putArray("result", array);

                         promise.resolve(result);
                     }

                     @Override
                     public void onError(int code, String message) {
                         WritableMap result = Arguments.createMap();

                         result.putBoolean("isSuccess", false);
                         result.putString("errorMessage", message);
                         result.putNull("result");

                         promise.resolve(result);
                     }
                 });
             }
         }).start();
    }

    private class DeleteCallbackWrapper implements DeleteBucketCallback {

        private Promise _promise;
        private String _bucketId;

        public DeleteCallbackWrapper(Promise promise, String bucketId) {
            _promise = promise;
            _bucketId = bucketId;
        }

        @Override
        public void onBucketDeleted() {
            _promise.resolve(new SingleResponse<String>(true, _bucketId, null));
        }

        @Override
        public void onError(int code, String message) {
            //TODO: create error model to pass both message and error code
            _promise.resolve(new SingleResponse<String>(false, null, message));
        }
    }

    private class RegisterCallbackWrapper implements RegisterCallback {

        private Promise _promise;
        private WritableMap _map;

        public RegisterCallbackWrapper(Promise promise) {
            _promise = promise;
            _map = Arguments.createMap();
        }

        @Override
        public void onConfirmationPending(final String email) {
            RegisterResponse response = new RegisterResponse(
                    true,
                    StorjAndroid.getInstance(getReactApplicationContext()).generateMnemonic(256),
                    null);

            _map.putBoolean("isSuccess", response.getResult());
            _map.putString("mnemonic", response.getMnemonic());
            _map.putString("errorMessage", response.getErrorMessage());

            _promise.resolve(_map);
        }

        @Override
        public void onError(int code, String message) {
            RegisterResponse response = new RegisterResponse(
                    false,
                    null,
                    message);

            _map.putBoolean("isSuccess", response.getResult());
            _map.putString("mnemonic", response.getMnemonic());
            _map.putString("errorMessage", response.getErrorMessage());

            _promise.resolve(_map);
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

            for (Bucket buck : buckets) {
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
        public void onError(int code, String message) {
            _promise.reject(E_GET_BUCKETS, message);
        }
    }
}
