package storjlib.dataprovider.contracts;

/**
 * Created by Yaroslav-Note on 3/7/2018.
 */

public class UploadingFileContract extends BaseContract {
    public final static String TABLE_NAME = "uploadingFiles";

    public final static String _FILE_HANDLE = "fileHandle";
    public final static String _NAME = "name";
    public final static String _URI = "uri";
    public final static String _PROGRESS = "progress";
    public final static String _SIZE = "size";
    public final static String _UPLOADED = "uploaded";

    public final static String _BUCKET_ID = "bucketId";
    //public final static String _DEFAULT_WHERE_CLAUSE = _FILE_HANDLE + " = ?";

    public static String createTable() {
        return String.format("create table if not exists %s (" +
                        "%s INTEGER primary key not null, " +
                        "%s TEXT not null, " +
                        "%s TEXT not null, " +
                        "%s INTEGER default 0, " +
                        "%s INTEGER default 0, " +
                        "%s INTEGER default 0, " +
                        "%s TEXT not null, " +
                        "FOREIGN KEY(%s) REFERENCES buckets(%s))",
                TABLE_NAME, _ID, _NAME, _URI, _PROGRESS, _SIZE, _UPLOADED, _BUCKET_ID, _BUCKET_ID, _ID);
    }
}
