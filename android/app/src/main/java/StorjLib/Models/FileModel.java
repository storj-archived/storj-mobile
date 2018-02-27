package StorjLib.Models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import io.storj.libstorj.File;

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


    public FileModel(File file) {
        _bucketId = file.getBucketId();
        _created = file.getCreated();
        _erasure = file.getErasure();
        _fileId = file.getId();
        _hmac = file.getHMAC();
        _index = file.getIndex();
        _mimeType = file.getMimeType();
        _name = file.getName();
        _size = file.getSize();
    }
}
