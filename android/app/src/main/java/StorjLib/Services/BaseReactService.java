package storjlib.services;

import android.app.IntentService;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import storjlib.GsonSingle;

/**
 * Created by Yaroslav-Note on 3/7/2018.
 */

public abstract class BaseReactService extends IntentService {

    protected String mServiceName;
    protected ReactContext mContext;
    private IBinder mBinder = new BaseReactServiceBinder();

    public BaseReactService(String serviceName) {
        super(serviceName);
        mServiceName = serviceName;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    public final void setReactContext(ReactContext reactContext) {
        mContext = reactContext;
    }

    public class BaseReactServiceBinder extends Binder {
        BaseReactService getService() {
            return BaseReactService.this;
        }
    }

    protected final <T> String toJson(T[] convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }

    protected final <T> String toJson(T convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }

    protected final void sendEvent(String eventName, WritableMap result) {
        if(mContext != null) {
            mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, result);
        }
    }

    protected final void sendEvent(String eventName, Boolean result) {
        if(mContext != null) {
            mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, result);
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "onCreate: " + mServiceName);
    }

    @Override
    public void onStart(Intent intent, int startId) {
        super.onStart(intent, startId);
        Log.d(TAG, "onStart: " + mServiceName);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand: " + mServiceName);
        return super.onStartCommand(intent, flags, startId);
    }

    private static final String TAG = "INTENT SERVICE DEBUG";
    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.d(TAG, "onTaskRemoved: " + mServiceName);
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy: " + mServiceName);
        super.onDestroy();
    }
}
