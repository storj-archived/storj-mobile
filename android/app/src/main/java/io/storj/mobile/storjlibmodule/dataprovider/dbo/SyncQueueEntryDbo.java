package io.storj.mobile.storjlibmodule.dataprovider.dbo;

import io.storj.mobile.storjlibmodule.dataprovider.contracts.SynchronizationQueueContract;
import io.storj.mobile.storjlibmodule.models.SyncQueueEntryModel;

public class SyncQueueEntryDbo {
    private int _id;
    private String _fileName;
    private String _localPath;
    private int _status;
    private int _errorCode;
    private long _size;
    private int _count;
    private String _creationDate;
    private String _bucketId;
    private long _fileHandle;

    public SyncQueueEntryDbo() {}

    public SyncQueueEntryDbo(SyncQueueEntryModel model) {
        this(model.getId(),
                model.getFileName(),
                model.getLocalPath(),
                model.getStatus(),
                model.getErrorCode(),
                model.getSize(),
                model.getCount(),
                model.getCreationDate(),
                model.getBucketId(),
                model.getFileHandle());
    }

    public SyncQueueEntryDbo(String fileName, String localPath, String bucketId) {
        this(0, fileName, localPath, 0, 0, 0, 0, null, bucketId, 0);
    }

    public SyncQueueEntryDbo(int id, String fileName, String localPath, int status, int errorCode, long size, int count, String creationDate, String bucketId, long fileHandle) {
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

    public void setProp(String key, int value) {
        switch (key) {
            case SynchronizationQueueContract._ID:
                _id = value;
                break;
            case SynchronizationQueueContract._STATUS:
                _status = value;
                break;
            case SynchronizationQueueContract._ERROR_CODE:
                _errorCode = value;
                break;
            case SynchronizationQueueContract._COUNT:
                _count = value;
                break;
        }
    }
    public void setProp(String key, long value) {
        switch (key) {
            case SynchronizationQueueContract._SIZE:
                _size = value;
                break;
            case SynchronizationQueueContract._FILE_HANDLE:
                _fileHandle = value;
                break;
        }
    }
    public void setProp(String key, String value) {
        switch (key) {
            case SynchronizationQueueContract._FILE_NAME:
                _fileName = value;
                break;
            case SynchronizationQueueContract._BUCKET_ID:
                _bucketId = value;
                break;
            case SynchronizationQueueContract._CREATION_DATE:
                _creationDate = value;
                break;
            case SynchronizationQueueContract._LOCAL_PATH:
                _localPath = value;
                break;
        }
    }
    public SyncQueueEntryModel toModel() {
        return new SyncQueueEntryModel(_id, _fileName, _localPath, _status, _errorCode, _size, _count, _creationDate, _bucketId, _fileHandle);
    }
}
