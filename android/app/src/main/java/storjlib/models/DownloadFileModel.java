package storjlib.models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Crawter on 27.02.2018.
 */

public class DownloadFileModel {
    @Expose
    @SerializedName("fileId")
    private String _fileId;
    @Expose
    @SerializedName("localPath")
    private String _localPath;

    public DownloadFileModel(String fileId, String localPath) {
        _fileId = fileId;
        _localPath = localPath;
    }
}
