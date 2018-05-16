package io.storj.mobile.storjlibmodule.models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import io.storj.mobile.storjlibmodule.dataprovider.contracts.SynchronizationQueueContract;


public class SyncQueueEntryModel {
    @Expose
    @SerializedName(SynchronizationQueueContract._ID)
    private int _id;
    @Expose
    @SerializedName(SynchronizationQueueContract._FILE_NAME)
    private String _fileName;
    @Expose
    @SerializedName(SynchronizationQueueContract._LOCAL_PATH)
    private String _localPath;
    @Expose
    @SerializedName(SynchronizationQueueContract._STATUS)
    private int _status;
    @Expose
    @SerializedName(SynchronizationQueueContract._ERROR_CODE)
    private int _errorCode;
    @Expose
    @SerializedName(SynchronizationQueueContract._SIZE)
    private long _size;
    @Expose
    @SerializedName(SynchronizationQueueContract._COUNT)
    private int _count;
    @Expose
    @SerializedName(SynchronizationQueueContract._CREATION_DATE)
    private String _creationDate;
    @Expose
    @SerializedName(SynchronizationQueueContract._BUCKET_ID)
    private String _bucketId;
    @Expose
    @SerializedName(SynchronizationQueueContract._FILE_HANDLE)
    private long _fileHandle;

    public SyncQueueEntryModel(int id, String fileName, String localPath, int status, int errorCode, long size, int count, String creationDate, String bucketId, long fileHandle) {
        _id = id;
        _fileName = fileName;
        _localPath = localPath;
        _status = status;
        _errorCode = errorCode;
        _size = size;
        _count = count;
        _creationDate = creationDate;
        _bucketId = bucketId;
        _fileHandle = fileHandle;
    }

    public boolean isValid() {
        return _fileName == null || _fileName.isEmpty()
                && _localPath == null || _localPath.isEmpty()
                && _bucketId == null || _bucketId.isEmpty(); // FILE SIZE?
    }

    public int getId() { return _id; }
    public String getFileName() { return _fileName; }
    public String getLocalPath() { return _localPath; }
    public int getStatus() { return _status; }
    public int getErrorCode() { return _errorCode; }
    public long getSize() { return _size; }
    public int getCount() { return _count; }
    public String getCreationDate() { return _creationDate; }
    public String getBucketId() { return _bucketId; }
    public long getFileHandle() { return _fileHandle; }
}
