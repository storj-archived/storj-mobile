package storjlib.dataProvider.repositories;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

import storjlib.Models.SettingsModel;
import storjlib.Responses.Response;
import storjlib.dataProvider.Dbo.SettingsDbo;
import storjlib.dataProvider.contracts.SettingsContract;

/**
 * Created by Yaroslav-Note on 3/19/2018.
 */

public class SettingsRepository extends BaseRepository {
    private String[] _columns = new String[] {
            SettingsContract._ID,
            SettingsContract._LAST_SYNC
    };

    public SettingsRepository(SQLiteDatabase db) {
        super(db);
    }

    public List<SettingsDbo> getAll() {
        Cursor cursor = _db.query(SettingsContract.TABLE_NAME, null, null, null, null, null, null);
        List<SettingsDbo> result = _getListFromCursor(cursor);

        cursor.close();

        return result;
    }

    public Response update(SettingsModel model) {
        ContentValues map = new ContentValues();

        map.put(SettingsContract._ID, model.getId());
        map.put(SettingsContract._LAST_SYNC, model.lastSync());

        return _executeUpdate(SettingsContract.TABLE_NAME, model.getId(), null, null, map);
    }

    public Response insert(SettingsModel model) {
        ContentValues map = new ContentValues();

        map.put(SettingsContract._ID, model.getId());
        //map.put(SettingsContract._LAST_SYNC, model.lastSync());

        return _executeInsert(SettingsContract.TABLE_NAME, map);
    }

    private SettingsDbo _getSingleFromCursor(Cursor cursor) {
        SettingsDbo model = null;

        if (cursor.moveToFirst()){
            model = _fillSettings(cursor);
        }

        return model;
    }


    private List<SettingsDbo> _getListFromCursor(Cursor cursor) {
        List<SettingsDbo> result = new ArrayList();

        if (cursor.moveToFirst()){
            do {
                result.add(_fillSettings(cursor));
            } while (cursor.moveToNext());
        }

        return result;
    }

    private SettingsDbo _fillSettings(Cursor cursor) {
        SettingsDbo dbo = new SettingsDbo();

        for(int i = 0; i < _columns.length; i++) {
            switch(_columns[i]) {
                case SettingsContract._ID:
                case SettingsContract._LAST_SYNC:
                    dbo.setProp(_columns[i], cursor.getString(cursor.getColumnIndex(_columns[i])));
                    break;
            }
        }

        return dbo;
    }
}
