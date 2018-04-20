package io.storj.mobile.storjlibmodule.callbackwrappers;

import com.facebook.react.bridge.Promise;

import io.storj.mobile.storjlibmodule.models.BucketModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.CreateBucketCallback;

/**
 * Created by Yaroslav-Note on 1/24/2018.
 */

public class CreateBucketCallbackWrapper extends BaseCallbackWrapper<BucketModel> implements CreateBucketCallback {

    public CreateBucketCallbackWrapper(Promise promise) {
        super(promise);
    }

    @Override
    public void onBucketCreated(Bucket bucket) {
        _promise.resolve(new SingleResponse(true, toJson(new BucketModel(bucket)), null).toWritableMap());
    }

    @Override
    public void onError(String bucketId, int code, String message) {
        _promise.resolve(new Response(false, message, code).toWritableMap());
    }
}
