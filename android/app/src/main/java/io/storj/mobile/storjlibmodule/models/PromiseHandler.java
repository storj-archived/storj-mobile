package io.storj.mobile.storjlibmodule.models;

import com.facebook.react.bridge.Promise;

/**
 * Created by Yaroslav-Note on 3/7/2018.
 */

public class PromiseHandler {
    private Promise mPromise;

    public PromiseHandler() {
        mPromise = null;
    }

    public PromiseHandler(Promise promise) {
        mPromise = promise;
    }

    public void nullify() {
        mPromise = null;
    }

    public Promise getPromise() {
        return mPromise;
    }

    public void setPromise(Promise promise) {
        mPromise = promise;
    }

    public void resolveString(String result) {
        if(mPromise != null) {
            mPromise.resolve(result);
            mPromise = null;
        }
    }

    public boolean isNull() {
        return mPromise == null;
    }
}
