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

    public CreateBucketCallbackWrapper(Promise promise) {
        _promise = promise;
    }

    @Override
    public void onBucketCreated(Bucket bucket) {
        _promise.resolve(new SingleResponse<>(true, new BucketWrapper(bucket).toString(), null));
    }

    @Override
    public void onError(int code, String message) {
        //TODO: create error model to pass both message and error code
        _promise.resolve(new SingleResponse<String>(false, null, message));
    }
}
