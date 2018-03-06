package StorjLib.Services;

import android.app.IntentService;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import StorjLib.GsonSingle;
import StorjLib.Models.BucketModel;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.GetBucketsCallback;
import io.storj.libstorj.android.StorjAndroid;

import static StorjLib.Services.ServiceModule.GET_BUCKETS;

/**
 * Created by Yaroslav-Note on 3/6/2018.
 */

public class GetBucketsService extends IntentService {

    private final static String EVENT_BUCKETS_UPDATED = "EVENT_BUCKETS_UPDATED";

    private Bucket[] _buckets;
    private ReactContext mContext;
    private IBinder mBinder = new GetBucketsServiceBinder();
    /**
     * Creates an IntentService.  Invoked by your subclass's constructor.
     */
    public GetBucketsService() {
        super("GetBucketsService");
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        String action = intent.getAction();

        switch(action) {
            case GET_BUCKETS:
                getBuckets();
                break;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    private void getBuckets() {
        StorjAndroid.getInstance(this).getBuckets(new GetBucketsCallback() {
            @Override
            public void onBucketsReceived(Bucket[] buckets) {
                _buckets = buckets;

                if(mContext != null) {
                    WritableMap map = new WritableNativeMap();

                    map.putBoolean("isSuccess", true);
                    map.putString("errorMessage", null);
                    map.putString("result", toJson(toBucketModelArray(buckets)));

                    mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_BUCKETS_UPDATED, map);
                }
            }

            @Override
            public void onError(int code, String message) {
                _buckets = null;

                if(mContext != null) {
                    WritableMap map = new WritableNativeMap();

                    map.putBoolean("isSuccess", false);
                    map.putString("errorMessage", message);
                    map.putString("result", null);

                    mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_BUCKETS_UPDATED, map);
                }
            }
        });
    }

    public class GetBucketsServiceBinder extends Binder {
        public GetBucketsService getService() { return GetBucketsService.this; }
    }

    public void setReactContext(ReactContext context) {
        mContext = context;
    }

    private BucketModel[] toBucketModelArray(Bucket[] buckets) {
        int length = buckets.length;
        BucketModel[] result = new BucketModel[length];

        for(int i = 0; i < length; i++) {
            result[i] = new BucketModel(buckets[i]);
        }

        return result;
    }

    private String toJson(BucketModel[] convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }
}
