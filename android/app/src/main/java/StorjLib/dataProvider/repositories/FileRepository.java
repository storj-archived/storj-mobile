package StorjLib.dataProvider.repositories;

import android.content.ContentValues;
import android.database.sqlite.SQLiteDatabase;

import javax.inject.Inject;

import StorjLib.Models.FileModel;
import StorjLib.Responses.Response;
import StorjLib.dataProvider.contracts.FileContract;

/**
 * Created by crawt on 3/4/2018.
 */

public class FileRepository extends BaseRepository {

    @Inject
    public FileRepository(SQLiteDatabase db) { super(db); }

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
}
