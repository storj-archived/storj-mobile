package io.storj.mobile.storjlibmodule;

import android.os.Environment;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import io.storj.mobile.storjlibmodule.callbackwrappers.RegisterCallbackWrapper;
import io.storj.mobile.storjlibmodule.models.KeyModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;

import java.io.File;

import io.storj.libstorj.Keys;
import io.storj.libstorj.Storj;
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
                int error = getStorj().verifyKeys(email, password);
                boolean isSuccess = error == 0;

                param.getPromise().resolve(new Response(isSuccess, E_VERIFY_KEYS, error).toWritableMap());
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
    public void deleteKeys(Promise promise) {
        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) throws Exception {
                boolean isSuccess = getStorj().deleteKeys();
                param.getPromise().resolve(new Response(isSuccess, null).toWritableMap());
            }
        });
    }

    @ReactMethod
    public void getKeys(final String passcode, Promise promise) {

        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) throws Exception {
                Keys keys = getStorj().getKeys(passcode);
                if(keys == null) {
                    param.getPromise().resolve(new Response(
                        false,  "keys are null").toWritableMap());
                    return;
                }
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
                    promise.resolve(new Response(false, "Mnemonic generation failed").toWritableMap());
                    return;
                }

                getStorj().register(login, password, new RegisterCallbackWrapper(promise, mnemonic));
            }
        });
    }

    @ReactMethod
    public void cancelDownload(final double fileRef, final Promise promise) {

        if(fileRef == 0)
        {
            promise.resolve(new Response(false, "File downloading is not started").toWritableMap());
            return;
        }

        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                boolean isSuccess = getStorj().cancelDownload((long)fileRef);
                promise.resolve(new Response(isSuccess, "").toWritableMap());
            }
        });
    }

    @ReactMethod
    public void cancelUpload(final double fileRef, final Promise promise) {

        if(fileRef == 0)
        {
            promise.resolve(new Response(false, "File uploading is not started").toWritableMap());
            return;
        }

        new MethodHandler().invokeParallel(new BaseMethodParams(promise), new IMethodHandlerCallback() {
            @Override
            public void callback(IMethodParams param) {
                boolean isSuccess = getStorj().cancelUpload((long)fileRef);
                promise.resolve(new Response(isSuccess, "").toWritableMap());
            }
        });
    }

    @ReactMethod
    public void getDownloadFolderPath(Promise promise){
        File downloadDir = Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS);
        SingleResponse response = null;

        if(downloadDir == null || !downloadDir.exists() || !downloadDir.isDirectory()) {
            response = new SingleResponse(false, null,
                    "Unable to retrieve downloads folder path.");
        } else {
            response = new SingleResponse(true, downloadDir.getAbsolutePath(), null);
        }
        
        promise.resolve(response.toWritableMap());
    }
}
