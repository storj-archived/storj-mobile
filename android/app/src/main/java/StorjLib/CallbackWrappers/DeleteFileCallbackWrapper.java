package storjlib.CallbackWrappers;

import com.facebook.react.bridge.Promise;

import storjlib.Models.FileDeleteModel;
import storjlib.Responses.Response;
import storjlib.Responses.SingleResponse;
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
    public void onFileDeleted() {
        _promise.resolve(new SingleResponse(_model.isValid(), toJson(_model), "").toWritableMap());
    }

    @Override
    public void onError(int code, String message) {
        _promise.resolve(new Response(false, "Error during file deletion", code).toWritableMap());
    }
}
