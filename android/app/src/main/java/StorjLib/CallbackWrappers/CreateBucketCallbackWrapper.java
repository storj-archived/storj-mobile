package StorjLib.CallbackWrappers;

import com.facebook.react.bridge.Promise;

import StorjLib.Responses.SingleResponse;
import StorjLib.StorjTypesWrappers.BucketWrapper;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.CreateBucketCallback;

/**
 * Created by Yaroslav-Note on 1/24/2018.
 */

public class CreateBucketCallbackWrapper implements CreateBucketCallback {

    private Promise _promise;
    private SingleResponse<BucketWrapper> _response;

    public CreateBucketCallbackWrapper(Promise promise, SingleResponse<BucketWrapper> response) {
        _promise = promise;
        _response = response;
    }

    @Override
    public void onBucketCreated(Bucket bucket) {
        _response.success(new BucketWrapper(bucket));
        _promise.resolve(_response.toJsObject());
    }

    @Override
    public void onError(int code, String message) {
        _response.error(message);
        _promise.resolve(_response.toJsObject());
    }
}
