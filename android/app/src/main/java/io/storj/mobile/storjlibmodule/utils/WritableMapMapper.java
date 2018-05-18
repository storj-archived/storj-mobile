package io.storj.mobile.storjlibmodule.utils;

import android.content.ContentValues;
import android.widget.Switch;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import io.storj.mobile.storjlibmodule.dataprovider.contracts.FileContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.UploadingFileContract;
import io.storj.mobile.storjlibmodule.services.UploadService2;

public class WritableMapMapper {

    public static WritableMap get(ContentValues values) {
        WritableMap map = new WritableNativeMap();

        if(values == null) {
            return map;
        }

        for (String key : values.keySet()) {
            switch(key) {
                case UploadingFileContract._FILE_HANDLE:
                case UploadingFileContract._PROGRESS:
                case UploadingFileContract._SIZE:
                case UploadingFileContract._UPLOADED:
                    map.putDouble(key, values.getAsDouble(key));
                    break;
                case FileContract._FILE_ID:
                case UploadService2.UploadEventEmitter.ERROR_MESSAGE:
                    map.putString(key, values.getAsString(key));
                    break;
                case UploadService2.UploadEventEmitter.ERROR_CODE:
                case UploadService2.PARAM_SYNC_ENTRY_ID:
                    map.putInt(key, values.getAsInteger(key));
                    break;
            }
        }

        return map;
    }
}
