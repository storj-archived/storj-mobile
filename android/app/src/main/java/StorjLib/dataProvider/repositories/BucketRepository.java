package StorjLib.dataProvider.repositories;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;

import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

import StorjLib.Models.BucketModel;
import StorjLib.Responses.ListResponse;
import StorjLib.Responses.Response;
import StorjLib.dataProvider.contracts.BucketContract;

/**
 * Created by Crawter on 02.03.2018.
 */

public class BucketRepository extends BaseRepository {

    @Inject
    public BucketRepository(SQLiteDatabase db) {
        super(db);
    }

    public ListResponse<BucketModel[]> get(String[] bucketIdList) {

        String[] columns = {
                BucketContract._ID,
                BucketContract._CREATED,
                BucketContract._NAME,
                BucketContract._HASH,
                BucketContract._DECRYPTED,
                BucketContract._STARRED
        };
        String[] selectionArgs = bucketIdList;
        String groupBy = null;
        String having = null;
        String orderBy = "column3 DESC";
        String limit = "10";

        Cursor cursor = _db.query(BucketContract.TABLE_NAME, columns, BucketContract._DEFAULT_WHERE_CLAUSE, selectionArgs, groupBy, having, orderBy, limit);
        return null;
    }

    public BucketModel get(String bucketId) {

        String[] columns = {
            BucketContract._ID,
            BucketContract._CREATED,
            BucketContract._NAME,
            BucketContract._HASH,
            BucketContract._DECRYPTED,
            BucketContract._STARRED
        };
        String[] selectionArgs = {
            bucketId
        };
        String groupBy = null;
        String having = null;
        String orderBy = "column3 DESC";
        String limit = "10";

        Cursor cursor = _db.query(BucketContract.TABLE_NAME, columns, BucketContract._DEFAULT_WHERE_CLAUSE, selectionArgs, groupBy, having, orderBy, limit);

        return null;
    }

    public Response insert(BucketModel model) {
        if(model == null || !model.isValid())
            return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(BucketContract._ID, model.getId());
        map.put(BucketContract._CREATED, model.getCreated());
        map.put(BucketContract._NAME, model.getName());
        map.put(BucketContract._HASH, model.getHashCode());
        map.put(BucketContract._DECRYPTED, model.isDecrypted());
        map.put(BucketContract._STARRED, model.isStarred());

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
        map.put(BucketContract._STARRED, model.isStarred());

        return _executeUpdate(BucketContract.TABLE_NAME, null,null, map);
    }

    //TODO: maybe it should be named updatedStarred or makeStarred?
    public Response update(String bucketId, boolean isStarred) {
        if(bucketId == null || bucketId.isEmpty())
            return new Response(false, "Model id is not valid!");

        String[] columnsToUpdate = new String[] {
                BucketContract._STARRED
        };

        String[] columnValues = new String[] {
                isStarred + ""
        };

        return _executeUpdate(BucketContract.TABLE_NAME, null,null, columnsToUpdate, columnValues);
    }
}
