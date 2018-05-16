package io.storj.mobile.storjlibmodule.models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import io.storj.mobile.storjlibmodule.dataprovider.dbo.UploadingFileDbo;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.UploadingFileContract;

/**
 * Created by Yaroslav-Note on 3/7/2018.
 */

public class UploadingFileModel {
    @Expose
    @SerializedName(UploadingFileContract._FILE_HANDLE)
    private long _fileHandle;
    @Expose
    @SerializedName(UploadingFileContract._PROGRESS)
    private double _progress;
    @Expose
    @SerializedName(UploadingFileContract._SIZE)
    private long _size;
    @Expose
    @SerializedName(UploadingFileContract._UPLOADED)
    private long _uploaded;

    @Expose
    @SerializedName(UploadingFileContract._NAME)
    private String _name;
    @Expose
    @SerializedName(UploadingFileContract._URI)
    private String _uri;
    @Expose
    @SerializedName(UploadingFileContract._BUCKET_ID)
    private String _bucketId;

    public UploadingFileModel(long fileHandle, long size, String name, String uri, String bucketId) {
        this(fileHandle, 0, size, 0, name, uri, bucketId);
    }

    public UploadingFileModel(UploadingFileDbo uploadingFileDbo) {
        this(uploadingFileDbo.getId(),
                uploadingFileDbo.getProgress(),
                uploadingFileDbo.getSize(),
                uploadingFileDbo.getUploaded(),
                uploadingFileDbo.getName(),
                uploadingFileDbo.getUri(),
                uploadingFileDbo.getBucketId());
    }

    public UploadingFileModel(long fileHandle, double progress, long size, long uploaded, String name, String uri, String bucketId) {
        _fileHandle = fileHandle;
        _progress = progress;
        _size = size;
        _uploaded = uploaded;
        _name = name;
        _uri = uri;
        _bucketId = bucketId;
    }

    public boolean isValid() {
        return  _name != null && !_name.isEmpty() &&
                _uri != null && !_uri.isEmpty() &&
                _bucketId != null && !_bucketId.isEmpty();
    }

    public long getFileHandle() {
        return _fileHandle;
    }
    public double getProgress() {
        return _progress;
    }
    public long getSize() {
        return _size;
    }
    public long getUploaded() {
        return _uploaded;
    }

    public String getName() {
        return _name;
    }
    public String getUri() {
        return _uri;
    }
    public String getBucketId() {
        return _bucketId;
    }
}
