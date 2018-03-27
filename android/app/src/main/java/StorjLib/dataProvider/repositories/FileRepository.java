package storjlib.dataProvider.repositories;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import storjlib.Models.FileModel;
import storjlib.Responses.Response;
import storjlib.dataProvider.Dbo.FileDbo;
import storjlib.dataProvider.contracts.FileContract;

/**
 * Created by crawt on 3/4/2018.
 */

public class FileRepository extends BaseRepository {
    private String[] _columns = new String[] {
        FileContract._ID,
        FileContract._CREATED,
        FileContract._DECRYPTED,
        FileContract._ERASURE,
        FileContract._HMAC,
        FileContract._INDEX,
        FileContract._MIMETYPE,
        FileContract._STARRED,
        FileContract._SIZE,
        FileContract._SYNCED,
        FileContract._DOWNLOAD_STATE,
        FileContract._FILE_HANDLE,
        FileContract.FILE_FK,
        FileContract._NAME
    };

    @Inject
    public FileRepository(SQLiteDatabase db) { super(db); }

    public List<FileDbo> getAll() {
        List<FileDbo> result = new ArrayList();
        Cursor cursor = _db.query(FileContract.TABLE_NAME, null, null, null, null, null, null, null);

        result = _getListFromCursor(cursor);

        cursor.close();

        return result;
    }

    public List<FileDbo> getAll(String bucketId) {
        List<FileDbo> result = new ArrayList();
        String[] selectionArgs = {
                bucketId
        };
        Cursor cursor = _db.query(FileContract.TABLE_NAME,
                null,
                FileContract.FILE_FK + " = ?",
                selectionArgs,
                null,
                null,
                null,
                null);

        result = _getListFromCursor(cursor);

        cursor.close();

        return result;
    }

    public List<FileDbo> getAll(String orderByColumn, boolean isDesc) {
        List<FileDbo> result = new ArrayList();
        String column = orderByColumn;

        if(orderByColumn != null && !orderByColumn.isEmpty()) {
            column = FileContract._CREATED;
        }

        String orderBy = isDesc ? column + " DESC" : orderByColumn + " ASC";

        Cursor cursor = _db.query(FileContract.TABLE_NAME, null, null, null, null, null, orderBy, null);

        result = _getListFromCursor(cursor);

        cursor.close();

        return result;
    }

    public List<FileDbo> getStarred() {
        List<FileDbo> result = new ArrayList();

        String selection = FileContract._STARRED + " = 1 ";

        Cursor cursor = _db.query(FileContract.TABLE_NAME, null, selection, null, null, null, null, null);

        result = _getListFromCursor(cursor);

        cursor.close();

        return result;
    }

    public FileDbo get(String fileId) {
        FileDbo model = null;
        String[] selectionArgs = {
                fileId
        };
        String orderBy = FileContract._CREATED + " DESC";

        Cursor cursor = _db.query(
                FileContract.TABLE_NAME,
                null,
                FileContract._ID + " = ?",
                selectionArgs,
                null, null, orderBy, null);

        model = _getSingleFromCursor(cursor);

        cursor.close();

        return model;
    }

    public FileDbo get(String param, String selection) {
        FileDbo model = null;
        String[] selectionArgs = {
                param
        };
        String orderBy = FileContract._CREATED + " DESC";

        Cursor cursor = _db.query(
                FileContract.TABLE_NAME,
                null,
                selection + " = ?",
                selectionArgs,
                null, null, orderBy, null);

        model = _getSingleFromCursor(cursor);

        cursor.close();

        return model;
    }

    public FileDbo get(String param, String selection, String bucketId) {
        FileDbo model = null;
        String[] selectionArgs = {
                param,
                bucketId
        };
        String orderBy = FileContract._CREATED + " DESC";

        Cursor cursor = _db.query(
                FileContract.TABLE_NAME,
                null,
                selection + " = ? and " + FileContract.FILE_FK + " = ?",
                selectionArgs,
                null, null, orderBy, null);

        model = _getSingleFromCursor(cursor);

        cursor.close();

        return model;
    }

    public Response insert(FileModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(FileContract._ID, model.getFileId());
        map.put(FileContract._CREATED, model.getCreated());
        map.put(FileContract._DECRYPTED, model.getDecrypted());
        map.put(FileContract._ERASURE, model.getErasure());
        map.put(FileContract._HMAC, model.getHmac());
        map.put(FileContract._INDEX, model.getIndex());
        map.put(FileContract._MIMETYPE, model.getMimeType());
        map.put(FileContract._STARRED, model.getStarred());
        map.put(FileContract._SYNCED, model.isSynced());
        map.put(FileContract._DOWNLOAD_STATE, model.downloadState());
        map.put(FileContract._FILE_HANDLE, model.getFileHandle());
        map.put(FileContract._SIZE, model.getSize());
        map.put(FileContract.FILE_FK, model.getBucketId());
        map.put(FileContract._NAME, model.getName());

        return _executeInsert(FileContract.TABLE_NAME, map);
    }

    public Response delete(FileModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        return _executeDelete(new String[] { model.getFileId() }, FileContract.TABLE_NAME, FileContract._DEFAULT_WHERE_CLAUSE);
    }

    public Response delete(String fileId) {
        if(fileId == null || fileId.isEmpty())
            return new Response(false, "Model id is not valid!");

        return _executeDelete(new String[] { fileId }, FileContract.TABLE_NAME, FileContract._DEFAULT_WHERE_CLAUSE);
    }

    public Response delete(String[] fileIdList) {
        if(fileIdList == null || fileIdList.length == 0)
            return new Response(false, "Model list is not valid!");

        return _executeDelete(fileIdList, FileContract.TABLE_NAME, FileContract._DEFAULT_WHERE_CLAUSE);
    }

    public Response deleteAll(String bucketId) {
        return _executeDelete(new String[] { bucketId }, FileContract.TABLE_NAME, FileContract.FILE_FK + " = ?s");
    }

    public Response update(FileModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(FileContract._CREATED, model.getCreated());
        map.put(FileContract._DECRYPTED, model.getDecrypted());
        map.put(FileContract._ERASURE, model.getErasure());
        map.put(FileContract._HMAC, model.getHmac());
        map.put(FileContract._INDEX, model.getIndex());
        map.put(FileContract._MIMETYPE, model.getMimeType());
        map.put(FileContract._STARRED, model.getStarred());
        map.put(FileContract._SYNCED, model.isSynced());
        map.put(FileContract._DOWNLOAD_STATE, model.downloadState());
        map.put(FileContract._FILE_HANDLE, model.getFileHandle());
        map.put(FileContract._SIZE, model.getSize());
        map.put(FileContract.FILE_FK, model.getBucketId());
        map.put(FileContract._NAME, model.getName());

        return _executeUpdate(FileContract.TABLE_NAME, model.getFileId(), null,null, map);
    }

    //TODO: maybe it should be named updatedStarred or makeStarred?
    public Response update(String fileId, boolean isStarred) {
        if(fileId == null || fileId.isEmpty())
            return new Response(false, "File id is not valid!");

        ContentValues map = new ContentValues();

        map.put(FileContract._STARRED, isStarred ? 1 : 0);

        return _executeUpdate(FileContract.TABLE_NAME, fileId, null,null, map);
    }

    public Response update(String fileId, int downloadState, long fileHandle) {
        if(fileId == null || fileId.isEmpty())
            return new Response(false, "File id is not valid!");

        ContentValues map = new ContentValues();

        map.put(FileContract._DOWNLOAD_STATE, downloadState);
        map.put(FileContract._FILE_HANDLE, fileHandle);

        return _executeUpdate(FileContract.TABLE_NAME, fileId, null,null, map);
    }

    private FileDbo _getSingleFromCursor(Cursor cursor) {
        FileDbo model = null;

        if (cursor.moveToFirst()){
            model = _fillFile(cursor);
        }

        return model;
    }


    private List<FileDbo> _getListFromCursor(Cursor cursor) {
        List<FileDbo> result = new ArrayList();

        if (cursor.moveToFirst()){
            do {
                result.add(_fillFile(cursor));
            } while (cursor.moveToNext());
        }

        return result;
    }

    private FileDbo _fillFile(Cursor cursor) {
        FileDbo model = new FileDbo();

            for(int i = 0; i < _columns.length; i++) {
                switch(_columns[i]) {
                    case FileContract._CREATED :
                    case FileContract._NAME :
                    case FileContract._ID :
                    case FileContract._ERASURE:
                    case FileContract._HMAC:
                    case FileContract._INDEX:
                    case FileContract._MIMETYPE:
                    case FileContract.FILE_FK:
                        model.setProp(_columns[i], cursor.getString(cursor.getColumnIndex(_columns[i])));
                        break;
                    case FileContract._DECRYPTED :
                    case FileContract._STARRED :
                    case FileContract._SYNCED :
                        model.setProp(_columns[i], cursor.getInt(cursor.getColumnIndex(_columns[i])) == 1 ? true : false);
                        break;
                    case FileContract._DOWNLOAD_STATE:
                        model.setProp(_columns[i], cursor.getInt(cursor.getColumnIndex(_columns[i])));
                        break;
                    case FileContract._SIZE :
                    case FileContract._FILE_HANDLE:
                        model.setProp(_columns[i], cursor.getLong(cursor.getColumnIndex(_columns[i])));
                        break;
                }
            }

        return model;
    }
}
