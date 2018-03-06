package StorjLib.dataProvider.repositories;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import StorjLib.Models.BucketModel;
import StorjLib.Responses.Response;
import StorjLib.dataProvider.Dbo.BucketDbo;
import StorjLib.dataProvider.contracts.BucketContract;

/**
 * Created by Crawter on 02.03.2018.
 */

public class BucketRepository extends BaseRepository {
    private String[] _columns = {
            BucketContract._ID,
            BucketContract._CREATED,
            BucketContract._NAME,
            BucketContract._HASH,
            BucketContract._DECRYPTED,
            BucketContract._STARRED
    };

    @Inject
    public BucketRepository(SQLiteDatabase db) {
        super(db);
    }

    public List<BucketDbo> getAll() {
        List<BucketDbo> result = new ArrayList();

        Cursor cursor = _db.query(BucketContract.TABLE_NAME, null, null, null, null, null, null, null);

        result = _getListFromCursor(cursor);

        cursor.close();

        return result;
    }

    public List<BucketDbo> getAll(String orderByColumn, boolean isDesc) {
        List<BucketDbo> result = new ArrayList();
        String column = orderByColumn;

        if(orderByColumn != null && !orderByColumn.isEmpty()) {
            column = BucketContract._CREATED;
        }

        String orderBy = isDesc ? column + " DESC" : orderByColumn + " ASC";

        Cursor cursor = _db.query(BucketContract.TABLE_NAME, null, null, null, null, null, orderBy, null);

        result = _getListFromCursor(cursor);

        cursor.close();

        return result;
    }

    public BucketDbo get(String bucketId) {
        BucketDbo model = null;
        String[] selectionArgs = {
            bucketId
        };
        String orderBy = BucketContract._CREATED + " DESC";

        Cursor cursor = _db.query(
                BucketContract.TABLE_NAME,
                _columns,
                BucketContract._DEFAULT_WHERE_CLAUSE,
                selectionArgs,
                null, null, orderBy, null);

        model = _getSingleFromCursor(cursor);

        cursor.close();

        return model;
    }

    public Response insert(BucketModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(BucketContract._ID, model.getId());
        map.put(BucketContract._CREATED, model.getCreated());
        map.put(BucketContract._NAME, model.getName());
        map.put(BucketContract._HASH, model.getHashCode());
        map.put(BucketContract._DECRYPTED, model.isDecrypted() ? 1 : 0);
        map.put(BucketContract._STARRED, model.isStarred() ? 1 : 0);

        return _executeInsert(BucketContract.TABLE_NAME, map);
    }

    public Response delete(BucketModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        return _executeDelete(new String[] { model.getId() }, BucketContract.TABLE_NAME, BucketContract._DEFAULT_WHERE_CLAUSE);
    }

    public Response delete(String bucketId) {
        if(bucketId == null || bucketId.isEmpty())
            return new Response(false, "Model id is not valid!");

        return _executeDelete(new String[] { bucketId }, BucketContract.TABLE_NAME, BucketContract._DEFAULT_WHERE_CLAUSE);
    }

    public Response delete(String[] bucketIdList) {
        if(bucketIdList == null || bucketIdList.length == 0)
            return new Response(false, "Model list is not valid!");

        return _executeDelete(bucketIdList, BucketContract.TABLE_NAME, BucketContract._DEFAULT_WHERE_CLAUSE);
    }

    public Response update(BucketModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(BucketContract._CREATED, model.getCreated());
        map.put(BucketContract._NAME, model.getName());
        map.put(BucketContract._HASH, model.getHashCode());
        map.put(BucketContract._DECRYPTED, model.isDecrypted());
        //map.put(BucketContract._STARRED, model.isStarred());

        return _executeUpdate(BucketContract.TABLE_NAME, model.getId(), null,null, map);
    }

    //TODO: maybe it should be named updatedStarred or makeStarred?
    public Response update(String bucketId, boolean isStarred) {
        if(bucketId == null || bucketId.isEmpty())
            return new Response(false, "Model id is not valid!");

        String[] columnsToUpdate = new String[] {
                BucketContract._STARRED
        };

        String[] columnValues = new String[] {
                Boolean.toString(isStarred)
        };

        return _executeUpdate(BucketContract.TABLE_NAME, bucketId, null,null, columnsToUpdate, columnValues);
    }

    private BucketDbo _getSingleFromCursor(Cursor cursor) {
        BucketDbo model = null;

        if (cursor.moveToFirst()){
            model = _fillBucket(cursor);
        }

        return model;
    }

    private List<BucketDbo> _getListFromCursor(Cursor cursor) {
        List<BucketDbo> result = new ArrayList();

        if (cursor.moveToFirst()){
            do {
                result.add(_fillBucket(cursor));
            } while (cursor.moveToNext());
        }

        return result;
    }

    private BucketDbo _fillBucket(Cursor cursor) {
        BucketDbo model = new BucketDbo();

        for(int i = 0; i < _columns.length; i++) {
            switch (_columns[i]) {
                case BucketContract._CREATED:
                case BucketContract._NAME:
                case BucketContract._ID:
                    model.setProp(_columns[i], cursor.getString(cursor.getColumnIndex(_columns[i])));
                    break;
                case BucketContract._DECRYPTED:
                case BucketContract._STARRED:
                    model.setProp(_columns[i], cursor.getInt(cursor.getColumnIndex(_columns[i])) == 1 ? true : false);
                    break;
                case BucketContract._HASH:
                    model.setProp(_columns[i], cursor.getLong(cursor.getColumnIndex(_columns[i])));
                    break;
            }
        }

        return model;
    }
}