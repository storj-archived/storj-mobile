package storjlib.StorjTypesWrappers;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import storjlib.Interfaces.IConvertibleToJs;
import io.storj.libstorj.Bucket;

/**
 * Created by Yaroslav-Note on 1/24/2018.
 */

public class BucketWrapper implements IConvertibleToJs {

    private Bucket _bucket;

    public BucketWrapper(Bucket bucket) {
        _bucket = bucket;
    }

    @Override
    public WritableMap toWritableMap() {
        WritableMap bucketJs = null;

        if(_bucket != null) {
            bucketJs = Arguments.createMap();

            bucketJs.putString("id", _bucket.getId());
            bucketJs.putString("name", _bucket.getName());
            bucketJs.putString("created", _bucket.getCreated());
            bucketJs.putInt("hash", _bucket.hashCode());
            bucketJs.putBoolean("isDecrypted", _bucket.isDecrypted());
        }

        return bucketJs;
    }
}
