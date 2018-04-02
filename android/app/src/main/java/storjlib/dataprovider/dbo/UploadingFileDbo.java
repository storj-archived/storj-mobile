package storjlib.dataprovider.dbo;

import storjlib.dataprovider.contracts.UploadingFileContract;

/**
 * Created by Yaroslav-Note on 3/7/2018.
 */

public class UploadingFileDbo {
    private long _fileHandle;
    private double _progress;
    private long _size;
    private long _uploaded;

    private String _name;
    private String _uri;
    private String _bucketId;

    private boolean isIdSet = false;

    public UploadingFileDbo() {}

    public UploadingFileDbo(long fileHandle, double progress, long size, long uploaded, String name, String uri, String bucketId) {
        _fileHandle = fileHandle;
        _progress = progress;
        _size = size;
        _uploaded = uploaded;
        _name = name;
        _uri = uri;
        _bucketId = bucketId;
    }

    public void setProp(String propName, String propValue) {
        switch(propName) {
            case UploadingFileContract._NAME:
                _name = propValue;
                break;
            case UploadingFileContract._URI:
                _uri = propValue;
                break;
            case UploadingFileContract._BUCKET_ID:
                _bucketId = propValue;
                break;
        }
    }

    public void setProp(String propName, long propValue) {
        switch (propName) {
            case UploadingFileContract._ID:
                _fileHandle = propValue;
                isIdSet = true;
                break;
            case UploadingFileContract._SIZE:
                _size = propValue;
                break;
            case UploadingFileContract._UPLOADED:
                _uploaded = propValue;
                break;
        }
    }

    public void setProp(String propName, double propValue) {
        switch (propName) {
            case UploadingFileContract._PROGRESS:
                _progress = propValue;
                break;
        }
    }

    //For thread sync this method should be called
    public boolean isIdSet() {
        return isIdSet;
    }

    public long getId() {
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
