package StorjLib.CallbackWrappers;

import com.facebook.react.bridge.Promise;

import StorjLib.GsonSingle;
import StorjLib.Models.BucketModel;
import StorjLib.Responses.Response;
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
        _promise.resolve(new SingleResponse(true, toJson(new BucketModel(bucket)), null).toWritableMap());
    }

    @Override
    public void onError(int code, String message) {
        //TODO: create error model to pass both message and error code
        _promise.resolve(new Response(false, message).toWritableMap());
    }

    private String toJson(BucketModel convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }
}
