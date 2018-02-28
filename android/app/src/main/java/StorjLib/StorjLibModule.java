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
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.security.Key;

import StorjLib.CallbackWrappers.CreateBucketCallbackWrapper;
import StorjLib.CallbackWrappers.DeleteFileCallbackWrapper;
import StorjLib.CallbackWrappers.DownloadFileCallbackWrapper;
import StorjLib.CallbackWrappers.ListFilesCallbackWrapper;
import StorjLib.CallbackWrappers.RegisterCallbackWrapper;
import StorjLib.CallbackWrappers.DeleteCallbackWrapper;
import StorjLib.CallbackWrappers.GetBucketsCallbackWrapper;
import StorjLib.CallbackWrappers.UploadFileCallbackWrapper;
import StorjLib.Models.KeyModel;
import StorjLib.Responses.Response;
import StorjLib.Responses.SingleResponse;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.DeleteFileCallback;
import io.storj.libstorj.DownloadFileCallback;
import io.storj.libstorj.File;
import io.storj.libstorj.GetBucketsCallback;
import io.storj.libstorj.Keys;
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

interface IMethodHandlerCallback {
    void callback(IMethodParams param) throws Exception;
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
    private static final String E_CREATE_BUCKET = "E_CREATE_BUCKET";
    private static final String MODULE_NAME = "StorjLibAndroid";

    public static long _downloadFileRef = 0;
    public static long _uploadFileRef = 0;

    public StorjLibModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    private Storj getStorj() {
        return StorjAndroid.getInstance(getReactApplicationContext());
    }

    private String toJson(Object convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }

    @ReactMethod
    @Deprecated
    public void generateMnemonic(Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                String result = Storj.generateMnemonic(256);
                boolean isSuccess = result != null && !result.isEmpty();

                param.getPromise().resolve(
                        new SingleResponse(isSuccess, result, "Unable to generate mnemonic").toWritableMap());
            }
        });
    }

    @ReactMethod
    public void checkMnemonic(final String mnemonic, Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                param.getPromise().resolve(
                        new Response(Storj.checkMnemonic(mnemonic), E_CHECK_MNEMONIC).toWritableMap());
            }
        });
    }

    @ReactMethod
    public void verifyKeys(final String email, final String password, final Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) throws Exception {
                boolean isSuccess = getStorj().verifyKeys(email, password) == 0;

                param.getPromise().resolve(new Response(isSuccess, E_VERIFY_KEYS).toWritableMap());
            }
        });
    }

    @ReactMethod
    public void keysExists(Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) throws Exception {
                param.getPromise().resolve(new Response(getStorj().keysExist(), E_VERIFY_KEYS).toWritableMap());
            }
        });
    }

    @ReactMethod
    public void importKeys(final String email, final String password, final String mnemonic, final String passcode, Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) throws Exception {
                boolean isSuccess = getStorj().importKeys(new Keys(email, password, mnemonic), passcode);
                param.getPromise().resolve(new Response(isSuccess, E_VERIFY_KEYS).toWritableMap());
            }
        });
    }

    @ReactMethod
    public void getKeys(final String passcode, Promise promise) {

        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) throws Exception {
                Keys keys = getStorj().getKeys(passcode);
                KeyModel result = new KeyModel(keys);

                param.getPromise().resolve(new SingleResponse(
                        result.isValid(), toJson(result), "Unable to get keys").toWritableMap());
            }
        });
    }

    @ReactMethod
    public void register(final String login, final String password, final Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                String mnemonic = Storj.generateMnemonic(256);
                boolean isSuccess = mnemonic != null && !mnemonic.isEmpty();

                if(!isSuccess){
                    promise.resolve(new Response(false, "Mnemonic generation failed"));
                    return;
                }

                getStorj().register(login, password, new RegisterCallbackWrapper(promise, mnemonic));
            }
        });
    }

    @ReactMethod
    public void createBucket(final String bucketName, final Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                getStorj().createBucket(bucketName, new CreateBucketCallbackWrapper(promise));
            }
        });
    }

    @ReactMethod
    void deleteBucket(final String bucketId, final Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                getStorj().deleteBucket(bucketId, new DeleteCallbackWrapper(promise, bucketId));
            }
        });
    }

    @ReactMethod
    public void getBuckets(final Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                getStorj().getBuckets(new GetBucketsCallbackWrapper(promise));
            }
        });
    }

    @ReactMethod
    public void downloadFile(final String bucketId,
                             final String fileId,
                             final String localPath,
                             final Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                _downloadFileRef = getStorj().downloadFile(bucketId, fileId, localPath, new DownloadFileCallbackWrapper(
                        getReactApplicationContext(), promise, bucketId, fileId, localPath));
            }
        });
    }

    @ReactMethod
    public void uploadFile(final String bucketId,
                           final String localPath,
                           final Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                _uploadFileRef = getStorj().uploadFile(bucketId, localPath, new UploadFileCallbackWrapper(
                        getReactApplicationContext(), promise, bucketId));
            }
        });
    }

    @ReactMethod
    public void deleteFile(final String bucketId, final String fileId, final Promise promise) {
        if(bucketId == null || fileId == null)
            return;

        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                getStorj().deleteFile(bucketId, fileId, new DeleteFileCallbackWrapper(promise, bucketId, fileId));
            }
        });
    }

    @ReactMethod
    public void listFiles(final String bucketId, final Promise promise) {

        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                getStorj().listFiles(bucketId, new ListFilesCallbackWrapper(promise));
            }
        });
    }

    @ReactMethod
    public void cancelDownload(final double fileRef, final Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                boolean isSuccess = getStorj().cancelDownload((long)fileRef);
                promise.resolve(new Response(isSuccess, "")) ;
            }
        });
    }

    @ReactMethod
    public void cancelUpload(final double fileRef, final Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                boolean isSuccess = getStorj().cancelUpload((long)fileRef);
                promise.resolve(new Response(isSuccess, "")) ;
            }
        });
    }
}
