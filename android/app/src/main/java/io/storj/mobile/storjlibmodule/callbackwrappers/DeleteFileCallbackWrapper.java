package io.storj.mobile.storjlibmodule.callbackwrappers;

import com.facebook.react.bridge.Promise;

import io.storj.mobile.storjlibmodule.models.FileDeleteModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
import io.storj.libstorj.DeleteFileCallback;

/**
 * Created by Crawter on 26.02.2018.
 */

public class DeleteFileCallbackWrapper extends BaseCallbackWrapper<FileDeleteModel> implements DeleteFileCallback {
    private FileDeleteModel _model;

    public DeleteFileCallbackWrapper(Promise promise, String bucketId, String fileId) {
        super(promise);
        _model = new FileDeleteModel(bucketId, fileId);
    }

    @Override
    public void onFileDeleted(String fileId) {
        _promise.resolve(new SingleResponse(_model.isValid(), toJson(_model), "").toWritableMap());
    }

    @Override
    public void onError(String fileId, int code, String message) {
        _promise.resolve(new Response(false, "Error during file deletion", code).toWritableMap());
    }
}
