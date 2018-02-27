package StorjLib.Models;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Crawter on 27.02.2018.
 */

public class DownloadFileProgressModel {
    @Expose
    @SerializedName("bucketId")
    private String _bucketId;

    @Expose
    @SerializedName("fileId")
    private String _fileId;

    @Expose
    @SerializedName("filePath")
    private String _filePath;

    @Expose
    @SerializedName("progress")
    private double _progress;

    @Expose
    @SerializedName("uploadedBytes")
    private long _uploadedBytes;

    @Expose
    @SerializedName("totalBytes")
    private long _totalBytes;

    public DownloadFileProgressModel(String bucketId, String fileId, String filePath, double progress, long uploadedBytes, long totalBytes) {
        _bucketId = bucketId;
        _fileId = fileId;
        _filePath = filePath;
        _progress = progress;
        _uploadedBytes = uploadedBytes;
        _totalBytes = totalBytes;
    }

    public WritableMap toWritableMap() {
        WritableMap wMap = new WritableNativeMap();

        wMap.putString("bucketId", _bucketId);
        wMap.putString("fileId", _fileId);
        wMap.putString("filePath", _filePath);
        wMap.putDouble("progress", _progress);
        wMap.putDouble("uploadedBytes", _uploadedBytes);
        wMap.putDouble("totalBytes", _totalBytes);

        return wMap;
    }
}
