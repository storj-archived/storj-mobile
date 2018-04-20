package io.storj.mobile.storjlibmodule.models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Crawter on 26.02.2018.
 */

public class FileDeleteModel implements IStorjModel {
    @Expose
    @SerializedName("bucketId")
    private String _bucketId;
    @Expose
    @SerializedName("fileId")
    private String _fileId;

    public FileDeleteModel(String bucketId, String fileId) {
        _bucketId = bucketId;
        _fileId = fileId;
    }

    @Override
    public boolean isValid() {
        return !_bucketId.isEmpty() && !_fileId.isEmpty();
    }
}
