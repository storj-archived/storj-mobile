package io.storj.mobile.storjlibmodule.dataprovider.contracts;

/**
 * Created by Crawter on 02.03.2018.
 */

public final class FileContract extends BaseContract {
    public final static String TABLE_NAME = "files";

    public final static String _FILE_ID = "fileId";
    public final static String _NAME = "name";
    public final static String _MIMETYPE = "mimeType";
    public final static String _INDEX = "_index";
    public final static String _HMAC = "hmac";
    public final static String _ERASURE = "erasure";
    public final static String _CREATED = "created";
    public final static String _DECRYPTED = "isDecrypted";
    public final static String _SIZE = "size";
    public final static String _STARRED = "isStarred";
    public final static String _SYNCED = "isSynced";
    public final static String _DOWNLOAD_STATE = "downloadState";
    public final static String _FILE_HANDLE = "fileHandle";
    public final static String _FILE_URI = "fileUri";
    public final static String _FILE_THUMBNAIL = "thumbnail";

    public final static String FILE_FK = "bucketId";

    public static String createTable() {
        return String.format(
                "create table if not exists %s (" +
                "%s TEXT primary key not null, " +
                "%s TEXT not null, " +
                "%s TEXT, " +
                "%s TEXT, " +
                "%s TEXT, " +
                "%s TEXT, " +
                "%s TEXT not null, " +
                "%s INTEGER, " +
                "%s INTEGER, " +
                "%s INTEGER, " +
                "%s INTEGER, " +
                "%s INTEGER DEFAULT 0, " +
                "%s INTEGER DEFAULT 0, " +
                "%s TEXT, " +
                "%s TEXT not null, " +
                "%s TEXT, " +
                "FOREIGN KEY(%s) REFERENCES buckets(%s) ON DELETE CASCADE)",
                TABLE_NAME, _ID, _NAME, _MIMETYPE, _INDEX, _HMAC, _ERASURE, _CREATED, _DECRYPTED, _STARRED, _SIZE, _SYNCED, _DOWNLOAD_STATE, _FILE_HANDLE, _FILE_URI, FILE_FK, _FILE_THUMBNAIL, FILE_FK, _ID );
    }
}
