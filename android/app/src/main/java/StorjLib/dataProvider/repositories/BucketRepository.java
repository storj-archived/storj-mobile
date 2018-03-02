package StorjLib.dataProvider.repositories;

import android.content.ContentValues;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;

import StorjLib.Models.BucketModel;
import StorjLib.Responses.Response;
import StorjLib.dataProvider.DatabaseFactory;
import StorjLib.dataProvider.contracts.BucketContract;

/**
 * Created by Crawter on 02.03.2018.
 */

public class BucketRepository {

    private SQLiteDatabase _db;

    public BucketRepository(SQLiteDatabase db) {
        _db = db;
    }

    public Response insert(BucketModel model) {
        if(!model.isValid()) return new Response(false, "Model is not valid!");

        ContentValues map = new ContentValues();

        map.put(BucketContract._ID, model.getId());
        map.put(BucketContract._CREATED, model.getCreated());
        map.put(BucketContract._NAME, model.getName());
        map.put(BucketContract._HASH, model.getHashCode());
        map.put(BucketContract._DECRYPTED, model.isDecrypted());

        try {
            _db.insertOrThrow(BucketContract.TABLE_NAME, null, map);
        } catch(SQLException error) {
            return new Response(false, error.getMessage());
        }

        return new Response(true, null);
    }
}
