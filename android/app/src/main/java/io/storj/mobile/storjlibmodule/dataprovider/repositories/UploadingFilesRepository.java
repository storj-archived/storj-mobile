package io.storj.mobile.storjlibmodule.dataprovider.repositories;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

import io.storj.mobile.storjlibmodule.models.UploadingFileModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.UploadingFileDbo;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.UploadingFileContract;

/**
 * Created by Yaroslav-Note on 3/7/2018.
 */

public class UploadingFilesRepository extends BaseRepository {

    private String[] _columns = {
            UploadingFileContract._ID,
            UploadingFileContract._PROGRESS,
            UploadingFileContract._SIZE,
            UploadingFileContract._UPLOADED,
            UploadingFileContract._NAME,
            UploadingFileContract._URI,
            UploadingFileContract._BUCKET_ID
    };

    public UploadingFilesRepository(SQLiteDatabase db) {
        super(db);
    }

    public List<UploadingFileDbo> getAll() {
        List<UploadingFileDbo> result = new ArrayList();

        Cursor cursor = _db.query(UploadingFileContract.TABLE_NAME, null, null, null, null, null, null, null);

        result = _getListFromCursor(cursor);

        cursor.close();

        return result;
    }

    public UploadingFileModel get(String id) {
        UploadingFileModel model = null;
        String[] selectionArgs = new String[] {
                id
        };

        Cursor cursor = _db.query(UploadingFileContract.TABLE_NAME,
                null,
                UploadingFileContract._ID + " = ?",
                selectionArgs,
                null, null, null);

        UploadingFileDbo uploadingFileDbo = _getSingleFromCursor(cursor);
        cursor.close();

        if(uploadingFileDbo != null) {
            model = new UploadingFileModel(uploadingFileDbo);
        }

        return model;
    }

    public UploadingFileModel get(String param, String columnName) {
        UploadingFileModel model = null;
        String[] selectionArgs = new String[] {
                param
        };

        Cursor cursor = _db.query(UploadingFileContract.TABLE_NAME,
                null,
                columnName + " = ?",
                selectionArgs,
                null, null, null);

        UploadingFileDbo uploadingFileDbo = _getSingleFromCursor(cursor);
        cursor.close();

        if(uploadingFileDbo != null) {
            model = new UploadingFileModel(uploadingFileDbo);
        }

        return model;
    }

    public Response insert(UploadingFileModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(UploadingFileContract._ID, model.getFileHandle());
        map.put(UploadingFileContract._PROGRESS, model.getProgress());
        map.put(UploadingFileContract._SIZE, model.getSize());
        map.put(UploadingFileContract._UPLOADED, model.getUploaded());
        map.put(UploadingFileContract._NAME, model.getName());
        map.put(UploadingFileContract._URI, model.getUri());
        map.put(UploadingFileContract._BUCKET_ID, model.getBucketId());

        return _executeInsert(UploadingFileContract.TABLE_NAME, map);
    }

    public Response update(UploadingFileModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(UploadingFileContract._PROGRESS, model.getProgress());
        map.put(UploadingFileContract._UPLOADED, model.getUploaded());

        return _executeUpdate(UploadingFileContract.TABLE_NAME, String.valueOf(model.getFileHandle()), null,null, map);
    }

    public Response delete(long fileHandle) {
        if(fileHandle == 0)
            return new Response(false, "Model id is not valid!");

        return _executeDelete(new String[] { String.valueOf(fileHandle) }, UploadingFileContract.TABLE_NAME, UploadingFileContract._DEFAULT_WHERE_CLAUSE);
    }

    public Response deleteAll() {
        return _deleteAll(UploadingFileContract.TABLE_NAME);
    }

    private List<UploadingFileDbo> _getListFromCursor(Cursor cursor) {
        List<UploadingFileDbo> result = new ArrayList();

        if (cursor.moveToFirst()){
            do {
                result.add(_fillUpFile(cursor));
            } while (cursor.moveToNext());
        }

        return result;
    }

    private UploadingFileDbo _getSingleFromCursor(Cursor cursor) {
        UploadingFileDbo model = null;

        if (cursor.moveToFirst()){
            model = _fillUpFile(cursor);
        }

        return model;
    }

    private UploadingFileDbo _fillUpFile(Cursor cursor) {
        UploadingFileDbo model = new UploadingFileDbo();

        for(int i = 0; i < _columns.length; i++) {
            switch (_columns[i]) {
                case UploadingFileContract._NAME:
                case UploadingFileContract._URI:
                case UploadingFileContract._BUCKET_ID:
                    model.setProp(_columns[i], cursor.getString(cursor.getColumnIndex(_columns[i])));
                    break;
                case UploadingFileContract._ID:
                case UploadingFileContract._SIZE:
                case UploadingFileContract._UPLOADED:
                    model.setProp(_columns[i], cursor.getLong(cursor.getColumnIndex(_columns[i])));
                    break;
                case UploadingFileContract._PROGRESS:
                    model.setProp(_columns[i], cursor.getDouble(cursor.getColumnIndex(_columns[i])));
                    break;
            }
        }
        return model;
    }
}
