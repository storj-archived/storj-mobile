package StorjLib.dataProvider;

import android.content.Context;
import android.database.DatabaseErrorHandler;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import StorjLib.dataProvider.contracts.BucketContract;
import StorjLib.dataProvider.contracts.FileContract;

/**
 * Created by Crawter on 02.03.2018.
 */

public class DatabaseFactory extends SQLiteOpenHelper {

    private static final int DATABASE_VERSION = 2;
    private static final String DATABASE_NAME = "storj.db";

    public DatabaseFactory(Context context, SQLiteDatabase.CursorFactory factory) {
        super(context, DATABASE_NAME, factory, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        createTables(db);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        dropTables(db);
        createTables(db);
    }

    private void createTables(SQLiteDatabase db) {
        db.execSQL(BucketContract.createTable());
        db.execSQL(FileContract.createTable());
    }

    private void dropTables(SQLiteDatabase db) {
        db.execSQL("DROP TABLE IF EXISTS " + BucketContract.TABLE_NAME);
        db.execSQL("DROP TABLE IF EXISTS " + FileContract.TABLE_NAME);
    }
}
