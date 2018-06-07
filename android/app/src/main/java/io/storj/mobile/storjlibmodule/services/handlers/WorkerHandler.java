package io.storj.mobile.storjlibmodule.services.handlers;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.services.callbacks.WorkerUploaderCallback;
import io.storj.mobile.storjlibmodule.services.eventemitters.UploadEventEmitter;
import io.storj.mobile.storjlibmodule.utils.Uploader;

public class WorkerHandler extends Handler {

    private Context mContext;

    public final static String PARAM_BUCKET_ID = "bucketId";
    public final static String PARAM_FILE_NAME = "fileName";
    public final static String PARAM_LOCAL_PATH = "localPath";

    public WorkerHandler(Looper looper, Context context) {
        super(looper);
        mContext = context;
    }

    @Override
    public void handleMessage(Message msg) {
        Bundle data = msg.getData();
        String fileName = data.getString(PARAM_FILE_NAME);
        String localPath = data.getString(PARAM_LOCAL_PATH);
        String bucketId = data.getString(PARAM_BUCKET_ID);

        try(SQLiteDatabase db = new DatabaseFactory(mContext, null).getWritableDatabase()) {
            Uploader uploader = new Uploader(mContext, new WorkerUploaderCallback(db, new UploadEventEmitter(mContext), false));
            uploader.uploadFile(bucketId, fileName, localPath);
        } catch (Exception e) {
            String message = e.getMessage();
        }
    }
}
