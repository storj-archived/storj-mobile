package StorjLib.CallbackWrappers;

import com.facebook.react.bridge.Promise;

import StorjLib.Responses.SingleResponse;
import io.storj.libstorj.DeleteBucketCallback;

/**
 * Created by Crawter on 22.02.2018.
 */

public class DeleteCallbackWrapper extends BaseCallbackWrapper implements DeleteBucketCallback {
    private String _bucketId;

    public DeleteCallbackWrapper(Promise promise, String bucketId) {
        super(promise);
        _bucketId = bucketId;
    }

    @Override
    public void onBucketDeleted() {
        _promise.resolve(new SingleResponse(true, _bucketId, null).toWritableMap());
    }

    @Override
    public void onError(int code, String message) {
        //TODO: create error model to pass both message and error code
        _promise.resolve(new SingleResponse(false, null, message).toWritableMap());
    }
}
