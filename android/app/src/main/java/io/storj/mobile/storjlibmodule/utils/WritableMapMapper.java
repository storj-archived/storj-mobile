package io.storj.mobile.storjlibmodule.utils;

import android.content.ContentValues;
import android.widget.Switch;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import io.storj.mobile.storjlibmodule.dataprovider.contracts.FileContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.UploadingFileContract;

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
                case "errorMessage":
                    map.putString(key, values.getAsString(key));
                    break;
                case "errorCode":
                    map.putInt(key, values.getAsInteger(key));
                    break;
            }
        }

        return map;
    }
}
