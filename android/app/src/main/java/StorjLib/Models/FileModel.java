package storjlib.Models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import io.storj.libstorj.File;
import storjlib.dataProvider.contracts.FileContract;

public class FileModel {
    @Expose
    @SerializedName("bucketId")
    private String _bucketId;
    @Expose
    @SerializedName("created")
    private String _created;
    @Expose
    @SerializedName("erasure")
    private String _erasure;
    @Expose
    @SerializedName("hmac")
    private String _hmac;
    @Expose
    @SerializedName("fileId")
    private String _fileId;
    @Expose
    @SerializedName("index")
    private String _index;
    @Expose
    @SerializedName("mimeType")
    private String _mimeType;
    @Expose
    @SerializedName("name")
    private String _name;
    @Expose
    @SerializedName("size")
    private long _size;
    @Expose
    @SerializedName("isDecrypted")
    private boolean _isDecrypted;
    @Expose
    @SerializedName("isStarred")
    private boolean _isStarred;
    @Expose
    @SerializedName("isSynced")
    private boolean _isSynced;
    @Expose
    @SerializedName(FileContract._DOWNLOAD_STATE)
    private int _downloadState;
    @Expose
    @SerializedName(FileContract._FILE_HANDLE)
    private long _fileHandle;

    public FileModel(File file) {
        this(file, false, false, 0, 0);
    }

    public FileModel(File file, boolean isStarred) {
        this(file, isStarred, false, 0, 0);
    }

    public FileModel(File file, boolean isStarred, boolean isSynced) { this(file, isStarred, isSynced, 0, 0); }

    public FileModel(File file, boolean isStarred, boolean isSynced, int downloadState, long fileHandle) {
        _bucketId = file.getBucketId();
        _created = file.getCreated();
        _erasure = file.getErasure();
        _fileId = file.getId();
        _hmac = file.getHMAC();
        _index = file.getIndex();
        _isDecrypted = file.isDecrypted();
        //_mimeType = file.getMimeType();
        _name = file.getName();
        _size = file.getSize();
        _isStarred = isStarred;
        _isSynced = isSynced;
        _downloadState = downloadState;
        _fileHandle = fileHandle;
    }

    public FileModel(String bucketId, String fileId, String created, String erasure, String hmac, String index, boolean isDecrypted, boolean isStarred, String mimeType, String name, long size) {
        _bucketId = bucketId;
        _created = created;
        _erasure = erasure;
        _fileId = fileId;
        _hmac = hmac;
        _index = index;
        _isDecrypted = isDecrypted;
        _mimeType = mimeType;
        _name = name;
        _size = size;
        _isStarred = isStarred;
    }

    public FileModel(String bucketId, String fileId, String created, String erasure, String hmac, String index, boolean isDecrypted, boolean isStarred, String mimeType, String name, long size, boolean isSynced) {
        _bucketId = bucketId;
        _created = created;
        _erasure = erasure;
        _fileId = fileId;
        _hmac = hmac;
        _index = index;
        _isDecrypted = isDecrypted;
        _mimeType = mimeType;
        _name = name;
        _size = size;
        _isStarred = isStarred;
        _isSynced = isSynced;
    }

    public boolean isValid() {
        return  _fileId != null && !_fileId.isEmpty() &&
                _bucketId != null && !_bucketId.isEmpty() &&
                _name != null && !_name.isEmpty() &&
                _created != null && !_created.isEmpty() &&
                _size > 0;
    }

    public String getBucketId() {
        return _bucketId;
    }
    public String getCreated() {
        return _created;
    }
    public String getErasure() {
        return _erasure;
    }
    public String getHmac() {
        return _hmac;
    }
    public String getFileId() {
        return _fileId;
    }
    public String getIndex() {
        return _index;
    }
    public String getMimeType() {
        return _mimeType;
    }
    public String getName() {
        return _name;
    }
    public long getSize() {
        return _size;
    }
    public boolean getDecrypted() {
        return _isDecrypted;
    }
    public boolean getStarred() {
        return _isStarred;
    }
    public boolean isSynced() { return _isSynced; }
    public int downloadState() { return _downloadState; }
    public long getFileHandle() { return _fileHandle; }
}
