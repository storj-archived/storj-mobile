package StorjLib.CallbackWrappers;

import com.facebook.react.bridge.Promise;

import StorjLib.GsonSingle;
import StorjLib.Models.FileDeleteModel;
import StorjLib.Responses.SingleResponse;
import io.storj.libstorj.DeleteFileCallback;

/**
 * Created by Crawter on 26.02.2018.
 */

public class DeleteFileCallbackWrapper implements DeleteFileCallback {
    private FileDeleteModel _model;
    private Promise _promise;

    public DeleteFileCallbackWrapper(Promise promise, String bucketId, String fileId) {
        _model = new FileDeleteModel(bucketId, fileId);
        _promise = promise;
    }

    @Override
    public void onFileDeleted() {
        _promise.resolve(new SingleResponse(_model.isValid(), toJson(_model), "").toWritableMap());
    }

    @Override
    public void onError(int code, String message) {
        _promise.resolve(new SingleResponse(false, null, "Error during file deletion").toWritableMap());
    }

    private String toJson(FileDeleteModel convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }
}
