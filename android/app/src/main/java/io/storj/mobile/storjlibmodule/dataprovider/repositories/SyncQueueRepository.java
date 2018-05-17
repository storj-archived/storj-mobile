package io.storj.mobile.storjlibmodule.dataprovider.repositories;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

import io.storj.mobile.storjlibmodule.dataprovider.contracts.SynchronizationQueueContract;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.SyncQueueEntryDbo;
import io.storj.mobile.storjlibmodule.models.SyncQueueEntryModel;
import io.storj.mobile.storjlibmodule.responses.Response;

public class SyncQueueRepository extends BaseRepository {

    private String[] _columns = {
            SynchronizationQueueContract._ID,
            SynchronizationQueueContract._FILE_NAME,
            SynchronizationQueueContract._LOCAL_PATH,
            SynchronizationQueueContract._STATUS,
            SynchronizationQueueContract._ERROR_CODE,
            SynchronizationQueueContract._SIZE,
            SynchronizationQueueContract._COUNT,
            SynchronizationQueueContract._CREATION_DATE,
            SynchronizationQueueContract._BUCKET_ID,
            SynchronizationQueueContract._FILE_HANDLE
    };

    public SyncQueueRepository(SQLiteDatabase db) {
        super(db);
    }

    public Response insert(SyncQueueEntryModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(SynchronizationQueueContract._FILE_NAME, model.getFileName());
        map.put(SynchronizationQueueContract._LOCAL_PATH, model.getLocalPath());
        map.put(SynchronizationQueueContract._BUCKET_ID, model.getBucketId());

        return _executeInsert(SynchronizationQueueContract.TABLE_NAME, map);
    }

    public Response update(SyncQueueEntryModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(SynchronizationQueueContract._FILE_NAME, model.getFileName());
        map.put(SynchronizationQueueContract._LOCAL_PATH, model.getLocalPath());
        map.put(SynchronizationQueueContract._STATUS, model.getStatus());
        map.put(SynchronizationQueueContract._ERROR_CODE, model.getErrorCode());
        map.put(SynchronizationQueueContract._SIZE, model.getSize());
        map.put(SynchronizationQueueContract._COUNT, model.getCount());
        map.put(SynchronizationQueueContract._BUCKET_ID, model.getBucketId());

        if(model.getFileHandle() != 0)
            map.put(SynchronizationQueueContract._FILE_HANDLE, model.getFileHandle());

        return _executeUpdate(SynchronizationQueueContract.TABLE_NAME, String.valueOf(model.getId()), null,null, map);
    }

    public Response delete(int id) {
        return _executeDelete(new String[] { String.valueOf(id) }, SynchronizationQueueContract.TABLE_NAME, SynchronizationQueueContract._DEFAULT_WHERE_CLAUSE);
    }

    public List<SyncQueueEntryModel> getAll() {
        List<SyncQueueEntryModel> result = new ArrayList();

        Cursor cursor = _db.query(SynchronizationQueueContract.TABLE_NAME, null, null, null, null, null, null, null);

        for(SyncQueueEntryDbo dbo : _getListFromCursor(cursor)) {
            result.add(dbo.toModel());
        }

        cursor.close();
        return result;
    }

    public SyncQueueEntryModel get(int id) {
        SyncQueueEntryModel model = null;
        String[] selectionArgs = new String[] {
                String.valueOf(id)
        };

        Cursor cursor = _db.query(SynchronizationQueueContract.TABLE_NAME,
                null,
                SynchronizationQueueContract._ID + " = ?",
                selectionArgs,
                null, null, null);

        SyncQueueEntryDbo dbo = _getSingleFromCursor(cursor);
        cursor.close();

        if(dbo != null) {
            model = dbo.toModel();
        }

        return model;
    }

    public SyncQueueEntryModel get(String fileName, String bucketId) {
        SyncQueueEntryModel model = null;
        String[] selectionArgs = new String[] {
            fileName,
            bucketId
        };

        Cursor cursor = _db.query(SynchronizationQueueContract.TABLE_NAME,
                null,
                SynchronizationQueueContract._FILE_NAME + " = ? AND " + SynchronizationQueueContract._BUCKET_ID + " = ?",
                selectionArgs,
                null, null, null);

        SyncQueueEntryDbo dbo = _getSingleFromCursor(cursor);
        cursor.close();

        if(dbo != null) {
            model = dbo.toModel();
        }

        return model;
    }

    private List<SyncQueueEntryDbo> _getListFromCursor(Cursor cursor) {
        List<SyncQueueEntryDbo> result = new ArrayList();

        if (cursor.moveToFirst()){
            do {
                result.add(_fillUpFile(cursor));
            } while (cursor.moveToNext());
        }

        return result;
    }

    private SyncQueueEntryDbo _getSingleFromCursor(Cursor cursor) {
        SyncQueueEntryDbo dbo = null;

        if (cursor.moveToFirst()){
            dbo = _fillUpFile(cursor);
        }

        return dbo;
    }

    private SyncQueueEntryDbo _fillUpFile(Cursor cursor) {
        SyncQueueEntryDbo dbo = new SyncQueueEntryDbo();

        for(int i = 0; i < _columns.length; i++) {
            switch (_columns[i]) {
                case SynchronizationQueueContract._ID:
                case SynchronizationQueueContract._STATUS:
                case SynchronizationQueueContract._ERROR_CODE:
                case SynchronizationQueueContract._COUNT:
                    dbo.setProp(_columns[i], cursor.getInt(cursor.getColumnIndex(_columns[i])));
                    break;
                case SynchronizationQueueContract._SIZE:
                case SynchronizationQueueContract._FILE_HANDLE:
                    dbo.setProp(_columns[i], cursor.getLong(cursor.getColumnIndex(_columns[i])));
                    break;
                case SynchronizationQueueContract._FILE_NAME:
                case SynchronizationQueueContract._BUCKET_ID:
                case SynchronizationQueueContract._LOCAL_PATH:
                case SynchronizationQueueContract._CREATION_DATE:
                    dbo.setProp(_columns[i], cursor.getString(cursor.getColumnIndex(_columns[i])));
                    break;
            }
        }
        return dbo;
    }
}
