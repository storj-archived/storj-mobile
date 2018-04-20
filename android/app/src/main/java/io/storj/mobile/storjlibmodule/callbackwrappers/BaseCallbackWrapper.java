package io.storj.mobile.storjlibmodule.callbackwrappers;

import com.facebook.react.bridge.Promise;

import io.storj.mobile.storjlibmodule.GsonSingle;

/**
 * Created by Crawter on 01.03.2018.
 */

public abstract class BaseCallbackWrapper<T> {

    protected Promise _promise;

    public BaseCallbackWrapper(Promise promise) {
        _promise = promise;
    }

    protected String toJson(T convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }
}
