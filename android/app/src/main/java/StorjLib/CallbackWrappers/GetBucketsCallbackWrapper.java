package storjlib.CallbackWrappers;

import com.facebook.react.bridge.Promise;

import storjlib.Models.BucketModel;
import storjlib.Responses.Response;
import storjlib.Responses.SingleResponse;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.GetBucketsCallback;

/**
 * Created by Crawter on 22.02.2018.
 */

public class GetBucketsCallbackWrapper extends BaseCallbackWrapper<BucketModel[]> implements GetBucketsCallback {
    private static final String TAG = "GetBucketsCallbackWrapp";
    private static final String E_GET_BUCKETS = "E_GET_BUCKETS";

    public GetBucketsCallbackWrapper(Promise promise) {
        super(promise);
    }

    @Override
    public void onBucketsReceived(Bucket[] buckets) {
        _promise.resolve(new SingleResponse(true, toJson(toBucketModelArray(buckets)), null).toWritableMap());
    }

    @Override
    public void onError(int code, String message) {
        _promise.resolve(new Response(false, message, code).toWritableMap());
    }

    private BucketModel[] toBucketModelArray(Bucket[] buckets) {
        int length = buckets.length;
        BucketModel[] result = new BucketModel[length];

        for(int i = 0; i < length; i++) {
            result[i] = new BucketModel(buckets[i]);
        }

        return result;
    }
}
