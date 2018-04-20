package io.storj.mobile.storjlibmodule.responses;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import io.storj.mobile.storjlibmodule.interfaces.IConvertibleToJs;

/**
 * Created by Crawter on 19.02.2018.
 */

public class Response implements IConvertibleToJs, IResponse {
    private final String KEY_IS_SUCCESS = "isSuccess";
    private final String KEY_ERROR = "error";

    protected final String KEY_RESULT = "result";

    private boolean _isSuccess = false;
    private Error _error = null;

    public Response(boolean isSuccess, String errorMessage) {
        _isSuccess = isSuccess;
        _error = new Error(errorMessage, 0);
    }

    public Response(boolean isSuccess, String errorMessage, int errorCode) {
        _isSuccess = isSuccess;
        _error = new Error(errorMessage, errorCode);
    }

    @Override
    public WritableMap toWritableMap() {
        WritableMap map = Arguments.createMap();

        map.putBoolean(KEY_IS_SUCCESS, _isSuccess);
        map.putMap(KEY_ERROR, _error.toWritableMap());

        return map;
    }

    public boolean isSuccess() {
        return _isSuccess;
    }
    public Error getError() { return _error; }
}

