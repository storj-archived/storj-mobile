package io.storj.mobile.storjlibmodule.services.eventemitters;

import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.support.v4.content.LocalBroadcastManager;

public class BaseEventEmitter {
    protected Context mContext;

    public final static String ACTION_EVENT = "ACTION_EVENT";
    public final static String PARAM_DATA = "data";
    public final static String PARAM_EVENT_NAME = "eventName";

    public BaseEventEmitter(Context context) {
        mContext = context;
    }

    public void Emit(String eventName, ContentValues map) {
        if(mContext == null) {
            return;
        }

//                ReactContext reactContext = ((ReactApplication)mContext).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
//                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                        .emit(eventName, WritableMapMapper.get(map));

        Intent eventIntent = new Intent(ACTION_EVENT);
        eventIntent.putExtra(PARAM_DATA, map);
        eventIntent.putExtra(PARAM_EVENT_NAME, eventName);

        LocalBroadcastManager.getInstance(mContext).sendBroadcast(eventIntent);
    }
}
