package StorjLib.Services;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

/**
 * Created by Yaroslav-Note on 3/6/2018.
 */

public class ServiceModule extends ReactContextBaseJavaModule {

    public final static String GET_BUCKETS = "GET_BUCKETS";

    private GetBucketsService mGetBucketsService;
    private Promise mPromise;

    private final ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            GetBucketsService.GetBucketsServiceBinder binder = (GetBucketsService.GetBucketsServiceBinder)service;
            mGetBucketsService = binder.getService();
            mGetBucketsService.setReactContext(getReactApplicationContext());

            if(mPromise != null) {
                mPromise.resolve(true);
                mPromise = null;
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            mGetBucketsService = null;
        }
    };

    public ServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ServiceModule";
    }

    @ReactMethod
    public void bindService(Promise promise) {
        mPromise = promise;
        Intent testIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
        getReactApplicationContext().bindService(testIntent, mConnection, Context.BIND_AUTO_CREATE);
    }

    @ReactMethod
    public void getBuckets() {
        Intent serviceIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
        serviceIntent.setAction(GET_BUCKETS);

        getReactApplicationContext().startService(serviceIntent);
    }
}
