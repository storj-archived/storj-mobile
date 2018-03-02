package StorjLib.CallbackWrappers;

import com.facebook.react.bridge.Promise;

import StorjLib.GsonSingle;
import StorjLib.Models.FileModel;
import StorjLib.Responses.Response;
import StorjLib.Responses.SingleResponse;
import StorjLib.StorjTypesWrappers.BucketWrapper;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.File;
import io.storj.libstorj.ListFilesCallback;

/**
 * Created by Crawter on 26.02.2018.
 */

public class ListFilesCallbackWrapper extends BaseCallbackWrapper<FileModel[]> implements ListFilesCallback {

    public ListFilesCallbackWrapper(Promise promise) {
        super(promise);
    }

    @Override
    public void onFilesReceived(File[] files) {

        _promise.resolve(new SingleResponse(true, toJson(toBucketModelArray(files)), null).toWritableMap());
    }

    @Override
    public void onError(int code, String message) {
        _promise.resolve(new Response(false, message, code).toWritableMap());
    }

    private FileModel[] toBucketModelArray(File[] buckets) {
        int length = buckets.length;
        FileModel[] result = new FileModel[length];

        for(int i = 0; i < length; i++) {
            result[i] = new FileModel(buckets[i]);
        }

        return result;
    }
}
