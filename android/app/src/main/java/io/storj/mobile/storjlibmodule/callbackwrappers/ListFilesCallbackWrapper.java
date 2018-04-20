package io.storj.mobile.storjlibmodule.callbackwrappers;

import com.facebook.react.bridge.Promise;

import io.storj.mobile.storjlibmodule.models.FileModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
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
    public void onFilesReceived(String s, File[] files) {
        _promise.resolve(new SingleResponse(true, toJson(toBucketModelArray(files)), null).toWritableMap());
    }

    @Override
    public void onError(String bucketId, int code, String message) {
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
