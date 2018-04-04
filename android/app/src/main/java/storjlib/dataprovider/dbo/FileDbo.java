package storjlib.dataprovider.dbo;

import storjlib.models.FileModel;
import storjlib.dataprovider.contracts.FileContract;

/**
 * Created by Crawter on 05.03.2018.
 */

public class FileDbo {
    private String _bucketId;
    private String _created;
    private String _erasure;
    private String _hmac;
    private String _fileId;
    private String _index;
    private String _mimeType;
    private String _name;
    private long _size;
    private boolean _isDecrypted;
    private boolean _isStarred;
    private boolean _isSynced;
    private int _downloadState;
    private long _fileHandle;
    private String _fileUri;
    private String _thumbnail;

    private boolean _isFileHandleSet;

    public String getId() {
        return _fileId;
    }
    public long getFileHandle() { return _fileHandle; }
    public boolean isFileHandleSet() { return _isFileHandleSet; }

    public void setProp(String propName, String value) {
        switch(propName) {
            case FileContract._ID:
                _fileId = value;
                break;
            case FileContract._CREATED:
                _created = value;
                break;
            case FileContract._ERASURE:
                _erasure = value;
                break;
            case FileContract._HMAC:
                _hmac = value;
                 break;
            case FileContract._INDEX:
                _index = value;
                break;
            case FileContract._MIMETYPE:
                _mimeType = value;
                break;
            case FileContract.FILE_FK:
                _bucketId = value;
                break;
            case FileContract._NAME:
                _name = value;
                break;
            case FileContract._FILE_URI:
                _fileUri = value;
                break;
            case FileContract._FILE_THUMBNAIL:
                _thumbnail = value;
                break;
        }
    }

    public void setProp(String propName, boolean value) {
        switch(propName) {
            case FileContract._DECRYPTED :
                _isDecrypted = value;
                break;
            case FileContract._STARRED :
                _isStarred = value;
                break;
            case FileContract._SYNCED:
                _isSynced = value;
                break;
        }
    }

    public void setProp(String propName, long value) {
        switch(propName) {
            case FileContract._SIZE:
                _size = value;
                break;
            case FileContract._FILE_HANDLE:
                _fileHandle = value;
                _isFileHandleSet = true;
                break;
        }

    }

    public void setProp(String propName, int value) {
        switch (propName) {
            case FileContract._DOWNLOAD_STATE:
                _downloadState = value;
                break;
        }
    }

    public FileModel toModel() {
        return new FileModel(_bucketId, _fileId, _created, _erasure, _hmac, _index, _isDecrypted, _isStarred, _mimeType, _name, _size, _isSynced, _downloadState, _fileUri, _thumbnail);
    }
}
