package io.storj.mobile.storjlibmodule.responses;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by Crawter on 22.02.2018.
 */

public class ListResponse<T> extends Response {
    private T _result = null;

    public ListResponse(T result, boolean isSuccess, String errorMessage) {
        super(isSuccess, errorMessage);
        _result = result;
    }

    @Override
    public WritableMap toWritableMap() {
        WritableMap map = super.toWritableMap();

        map.putArray(KEY_RESULT, Arguments.fromArray(_result));

        return map;
    }

    public T getResult() {
        return _result;
    }
}
