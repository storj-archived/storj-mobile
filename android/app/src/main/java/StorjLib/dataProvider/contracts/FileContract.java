package StorjLib.dataProvider.contracts;

/**
 * Created by Crawter on 02.03.2018.
 */

public final class FileContract extends BaseContract {
    public final static String TABLE_NAME = "files";

    public final static String _NAME = "name";
    public final static String _MIMETYPE = "mimeType";
    public final static String _INDEX = "_index";
    public final static String _HMAC = "hmac";
    public final static String _ERASURE = "erasure";
    public final static String _CREATED = "created";
    public final static String _DECRYPTED = "isDecrypted";
    public final static String _SIZE = "size";
    public final static String _STARRED = "isStarred";

    public final static String FILE_FK = "bucketId";

    public static String createTalbe() {
        return String.format(
                "create table if not exists %s (" +
                "%s TEXT primary key not null, " +
                "%s TEXT not null, " +
                "%s TEXT not null, " +
                "%s TEXT not null, " +
                "%s TEXT not null, " +
                "%s TEXT not null, " +
                "%s TEXT not null, " +
                "%s INTEGER, " +
                "%s INTEGER, " +
                "%s INTEGER, " +
                "%s TEXT not null, " +
                "FOREIGN KEY(%s) REFERENCES buckets(%s))",
                TABLE_NAME, _ID, _NAME, _MIMETYPE, _INDEX, _HMAC, _ERASURE, _CREATED, _DECRYPTED, _STARRED, _SIZE, FILE_FK, FILE_FK, _ID );
    }
}
