package storjlib.Models;

/**
 * Created by Crawter on 26.02.2018.
 */

public class FileDeleteModel implements IStorjModel {
    private String _bucketId;
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
