package StorjLib.dataProvider.repositories;

import android.content.ContentValues;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;

import StorjLib.Models.IStorjModel;
import StorjLib.Responses.Response;
import StorjLib.dataProvider.contracts.BaseContract;
import StorjLib.dataProvider.repositories.Interfaces.IInsertCallback;

/**
 * Created by crawt on 3/3/2018.
 */

public abstract class BaseRepository {
    protected SQLiteDatabase _db;

    public BaseRepository(SQLiteDatabase db) {
        _db = db;
    }

//    public Response executeInsert(T model, IInsertCallback<T> callback, String tableName)  {
//        if(!model.isValid()) return new Response(false, "Model is not valid!");
//
//        ContentValues map = callback.callback();
//
//        try {
//            _db.insertOrThrow(tableName, null, map);
//        } catch(SQLException error) {
//            return new Response(false, error.getMessage());
//        }
//
//        return new Response(true, null);
//    }

    protected Response _executeInsert(String tableName, ContentValues valuesMap)  {

        try {
            _db.insertOrThrow(tableName, null, valuesMap);
        } catch(SQLException error) {
            return new Response(false, error.getMessage());
        }

        return new Response(true, null);
    }

    protected Response _executeDelete(String[] ids, String tableName, String whereClause) {
        boolean isSuccess;

        try {
            isSuccess = _db.delete(tableName, whereClause, ids) > 0;
        } catch(SQLException error) {
            return new Response(false, error.getMessage());
        }

        return new Response(isSuccess, null);
    }

    protected Response _executeUpdate(String tableName, String[] columnNames, String[] columnValues, String[] columnsToUpdate, String [] updatedValues) {
        boolean isSuccess;

        ContentValues map = _getContentMap(columnsToUpdate, updatedValues);

        String whereClause = _getWhereClause(columnNames, columnValues);

        try {
            _db.update(tableName, map, whereClause, null);
        } catch (Exception e) {
            return new Response(false, e.getMessage());
        }
        return new Response(true, null);
    }

    protected Response _executeUpdate(String tableName, String[] columnNames, String[] columnValues, ContentValues map) {
        boolean isSuccess;

        String whereClause = _getWhereClause(columnNames, columnValues);

        try {
            _db.update(tableName, map, whereClause, null);
        } catch (Exception e) {
            return new Response(false, e.getMessage());
        }

        return new Response(true, null);
    }

    private static String _getWhereClause(String[] columnNames, String[] columnValues) {
        boolean columnNamesAreValid = columnNames != null && columnNames.length != 0;
        boolean columnValuesAreValid = columnValues != null && columnValues.length != 0;

        if (!(columnNamesAreValid && columnValuesAreValid))
            return BaseContract._DEFAULT_WHERE_CLAUSE;

        int length = columnNames.length < columnValues.length
                ? columnNames.length : columnValues.length;

        StringBuilder sb = new StringBuilder();

        for(int i = 0; i < length; i++) {
            sb.append(columnNames[i]);
            sb.append("=");
            sb.append(columnValues[i]);
        }

        return sb.toString();
    }

    private static ContentValues _getContentMap(String[] columnNames, String[] columnValues) {
        ContentValues map = new ContentValues();

        boolean columnNamesAreValid = columnNames != null && columnNames.length != 0;
        boolean columnValuesAreValid = columnValues != null && columnValues.length != 0;

        if (!(columnNamesAreValid && columnValuesAreValid))
            return map;

        int length = columnNames.length < columnValues.length
                ? columnNames.length : columnValues.length;

        for(int i = 0; i < length; i++) {
            map.put(columnNames[i], columnValues[i]);
        }

        return map;
    }


}
