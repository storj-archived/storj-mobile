package StorjLib.Models;

import android.provider.BaseColumns;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import io.storj.libstorj.Bucket;

/**
 * Created by Crawter on 22.02.2018.
 */

public class BucketModel implements IStorjModel {
    @Expose
    @SerializedName("id")
    private String _id;

    @Expose
    @SerializedName("name")
    private String _name;

    @Expose
    @SerializedName("created")
    private String _created;

    @Expose
    @SerializedName("hash")
    private long _hash;

    @Expose
    @SerializedName("isDecrypted")
    private boolean _isDecrypted;

    @Expose
    @SerializedName("isStarred")
    private boolean _isStarred;

    public BucketModel(String id, String name, String created, long hash, boolean isDecrypted) {
        _id = id;
        _name = name;
        _created = created;
        _hash = hash;
        _isDecrypted = isDecrypted;
    }

    public BucketModel(String id, String name, String created, long hash, boolean isDecrypted, boolean isStarred) {
        _id = id;
        _name = name;
        _created = created;
        _hash = hash;
        _isDecrypted = isDecrypted;
        _isStarred = isStarred;
    }

    public BucketModel(Bucket bucket) {
        _id = bucket.getId();
        _name = bucket.getName();
        _created = bucket.getCreated();
        _hash = bucket.hashCode();
        _isDecrypted = bucket.isDecrypted();
    }

    //TODO: how to verify hashCode?
    public boolean isValid() {
        return  _id != null && !_id.isEmpty() &&
                _name != null && !_name.isEmpty() &&
                _created != null && !_created.isEmpty();
    }

    public String getId() {
        return _id;
    }
    public String getName() {
        return _name;
    }
    public String getCreated() {
        return _created;
    }
    public long getHashCode() {
        return _hash;
    }
    public boolean isDecrypted() {
        return _isDecrypted;
    }
    public boolean isStarred() { return _isStarred; }
}
