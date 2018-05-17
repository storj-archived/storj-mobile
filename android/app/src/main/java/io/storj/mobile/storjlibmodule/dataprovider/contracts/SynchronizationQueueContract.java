package io.storj.mobile.storjlibmodule.dataprovider.contracts;

public final class SynchronizationQueueContract extends BaseContract {
    public final static String TABLE_NAME = "synchronizationQueue";

    public final static String _FILE_NAME = "fileName";
    public final static String _LOCAL_PATH = "localPath";
    public final static String _STATUS = "status";
    public final static String _ERROR_CODE = "errorCode";
    public final static String _SIZE = "size";
    public final static String _COUNT = "count";
    public final static String _CREATION_DATE = "creationDate";

    public final static String _BUCKET_ID = "bucketId";
    public final static String _FILE_HANDLE = "fileHandle";

    public static String createTable() {
        return String.format("create table if not exists %s (" + //table
                        "%s INTEGER primary key AUTOINCREMENT not null, " + //id NOT SET
                        "%s TEXT not null, " + //fileName
                        "%s TEXT not null, " + //localPath
                        "%s INTEGER default 0, " + //status
                        "%s INTEGER default 0, " + //errorCode
                        "%s INTEGER default 0, " + //size
                        "%s INTEGER default 0, " + //count
                        "%s TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " + //creationDate //NOT SET
                        "%s TEXT not null, " + //bucketId
                        "%s INTEGER, " + //fileHandle
                        "FOREIGN KEY(%s) REFERENCES uploadingFiles(%s) ON DELETE SET NULL, " + //uploadingfiles FK
                        "FOREIGN KEY(%s) REFERENCES buckets(%s) ON DELETE SET NULL)", //buckets FK
                TABLE_NAME, _ID, _FILE_NAME, _LOCAL_PATH, _STATUS, _ERROR_CODE, _SIZE, _COUNT, _CREATION_DATE, _BUCKET_ID, _FILE_HANDLE, _FILE_HANDLE, _ID, _BUCKET_ID, _ID);
    }
}
