package StorjLib.dataProvider.repositories;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import StorjLib.Models.FileModel;
import StorjLib.Responses.Response;
import StorjLib.dataProvider.Dbo.FileDbo;
import StorjLib.dataProvider.contracts.FileContract;

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
        FileContract.FILE_FK,
        FileContract._NAME
    };

    @Inject
    public FileRepository(SQLiteDatabase db) { super(db); }

    public List<FileDbo> getAll() {
        List<FileDbo> result = new ArrayList();
        Cursor cursor = _db.query(FileContract.TABLE_NAME, null, null, null, null, null, null, null);

        if (cursor.moveToFirst()){
            do{
                result.add(_fillFile(cursor));
            } while(cursor.moveToNext());
        }

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

        if (cursor.moveToFirst()){
            do{
                result.add(_fillFile(cursor));
            } while(cursor.moveToNext());
        }

        cursor.close();

        return result;
    }

    public FileDbo get(String bucketId) {
        FileDbo model = null;
        String[] selectionArgs = {
                bucketId
        };
        String orderBy = FileContract._CREATED + " DESC";

        Cursor cursor = _db.query(
                FileContract.TABLE_NAME,
                _columns,
                FileContract._DEFAULT_WHERE_CLAUSE,
                selectionArgs,
                null, null, orderBy, null);

        if (cursor.moveToFirst()){
            model = _fillFile(cursor);
        }

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
        map.put(FileContract._SIZE, model.getSize());
        map.put(FileContract._NAME, model.getName());

        return _executeUpdate(FileContract.TABLE_NAME, null,null, map);
    }

    //TODO: maybe it should be named updatedStarred or makeStarred?
    public Response update(String fileId, boolean isStarred) {
        if(fileId == null || fileId.isEmpty())
            return new Response(false, "Model id is not valid!");

        String[] columnsToUpdate = new String[] {
                FileContract._STARRED
        };

        String[] columnValues = new String[] {
                isStarred + ""
        };

        return _executeUpdate(FileContract.TABLE_NAME, null,null, columnsToUpdate, columnValues);
    }

    private FileDbo _fillFile(Cursor cursor) {
        FileDbo model = new FileDbo();
        if (cursor.moveToFirst()){
            do {
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
                            model.setProp(_columns[i], Boolean.getBoolean(cursor.getString(cursor.getColumnIndex(_columns[i]))));
                            break;
                        case FileContract._SIZE :
                            model.setProp(_columns[i], cursor.getLong(cursor.getColumnIndex(_columns[i])));
                            break;
                    }
                }
            } while(cursor.moveToNext());
        }

        return model;
    }
}
