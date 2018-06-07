package io.storj.mobile.storjlibmodule.services.handlers;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.interfaces.NotificationResolver;
import io.storj.mobile.storjlibmodule.services.NotificationService;
import io.storj.mobile.storjlibmodule.services.UploadService;
import io.storj.mobile.storjlibmodule.services.callbacks.SyncUploaderCallback;
import io.storj.mobile.storjlibmodule.services.eventemitters.UploadEventEmitter;
import io.storj.mobile.storjlibmodule.utils.Uploader;

public class SyncHandler extends Handler {
    private Context mContext;

    public final static String PARAM_BUCKET_ID = "bucketId";
    public final static String PARAM_FILE_NAME = "fileName";
    public final static String PARAM_LOCAL_PATH = "localPath";
    public final static String PARAM_SYNC_ENTRY_ID = "syncEntryId";

    public SyncHandler(Looper looper, Context context) {
        super(looper);
        mContext = context;
    }

    @Override
    public void handleMessage(Message msg) {
        Bundle data = msg.getData();
        String fileName = data.getString(PARAM_FILE_NAME);
        String localPath = data.getString(PARAM_LOCAL_PATH);
        String bucketId = data.getString(PARAM_BUCKET_ID);
        int syncEntryId = data.getInt(PARAM_SYNC_ENTRY_ID);

        try(SQLiteDatabase db = new DatabaseFactory(mContext, null).getWritableDatabase()) {

            NotificationService notificationService = new NotificationService();
            notificationService.init(mContext, mContext instanceof NotificationResolver ? (NotificationResolver) mContext : null);

            SyncUploaderCallback syncUploaderCallback = new SyncUploaderCallback(mContext,
                    db,
                    new UploadEventEmitter(mContext),
                    notificationService,
                    syncEntryId);

            Uploader uploader = new Uploader(mContext, syncUploaderCallback);
            uploader.uploadFile(bucketId, fileName, localPath);
        } catch (Exception e) {
            String message = e.getMessage();
        }
    }
}
