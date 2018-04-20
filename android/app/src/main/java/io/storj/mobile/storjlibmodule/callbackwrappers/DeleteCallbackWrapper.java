package io.storj.mobile.storjlibmodule.callbackwrappers;

import com.facebook.react.bridge.Promise;

import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
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
    public void onBucketDeleted(String bucketId) {
        _promise.resolve(new SingleResponse(true, _bucketId, null).toWritableMap());
    }

    @Override
    public void onError(String bucketId, int code, String message) {
        _promise.resolve(new Response(false, message, code).toWritableMap());
    }
}
