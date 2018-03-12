package storjlib.services;

import android.app.PendingIntent;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.storjmobile.R;

import storjlib.Models.FileModel;
import storjlib.Models.UploadingFileModel;
import storjlib.Responses.Response;
import storjlib.dataProvider.DatabaseFactory;
import storjlib.dataProvider.Dbo.UploadingFileDbo;
import storjlib.dataProvider.contracts.FileContract;
import storjlib.dataProvider.contracts.UploadingFileContract;
import storjlib.dataProvider.repositories.FileRepository;
import storjlib.dataProvider.repositories.UploadingFilesRepository;
import io.storj.libstorj.File;
import io.storj.libstorj.UploadFileCallback;
import io.storj.libstorj.android.StorjAndroid;

/**
 * Created by Yaroslav-Note on 3/7/2018.
 */

public final class UploadService extends BaseReactService {

    public final static String ACTION_UPLOAD_FILE = "UPLOAD_FILE";
    public final static String ACTION_UPLOAD_FILE_CANCEL = "UPLOAD_FILE_CANCEL";

    public final static String EVENT_FILE_UPLOAD_START = "EVENT_FILE_UPLOAD_START";
    public final static String EVENT_FILE_UPLOADED_PROGRESS = "EVENT_FILE_UPLOADED_PROGRESS";
    public final static String EVENT_FILE_UPLOADED_SUCCESSFULLY = "EVENT_FILE_UPLOADED_SUCCESSFULLY";
    public final static String EVENT_FILE_UPLOAD_ERROR = "EVENT_FILE_UPLOAD_ERROR";

    public final static int UPLOAD_CANCEL_REQUEST_CODE = 223132;

    private NotificationService mNotificationService = new NotificationService(UploadService.this);

    public UploadService() {
        super("UploadService");
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        String action = intent.getAction();

        switch(action) {
            case ACTION_UPLOAD_FILE:
                uploadFile(intent.getStringExtra("bucketId"),
                        intent.getStringExtra("uri"));
                break;
            case ACTION_UPLOAD_FILE_CANCEL:
                long fileHandle = intent.getLongExtra("fileHandle", -1);
                Log.d("UPLOAD DEBUG", "File upload cancel action: " + Thread.currentThread().getId() + ". Handle: " + fileHandle);
                uploadFileCancel(fileHandle);
                break;
        }
    }

    private void uploadFileCancel(long fileHandle) {
        if(fileHandle == -1) {
            return;
        }

        StorjAndroid.getInstance(this).cancelUpload(fileHandle);
    }

    private void uploadFile(String bucketId, String uri) {
        java.io.File file = new java.io.File(uri);

        if(bucketId == null || !file.exists()) {
            return;
        }
        final SQLiteDatabase db = new DatabaseFactory(UploadService.this, null).getWritableDatabase();
        final UploadingFilesRepository repo = new UploadingFilesRepository(db);

        final UploadingFileDbo dbo = new UploadingFileDbo(0, 0, file.getTotalSpace(), 0, file.getName(), uri, bucketId);

        Log.d("UPLOAD DEBUG", "File upload call: " + Thread.currentThread().getId() + ". Uri: " + uri);
        final long fileHandle = StorjAndroid.getInstance(getApplicationContext()).uploadFile(bucketId, uri, new UploadFileCallback() {
            @Override
            public void onProgress(String filePath, double progress, long uploadedBytes, long totalBytes) {
                synchronized (dbo) {
                    try {
                        long threadName = Thread.currentThread().getId();
                        if(!dbo.isIdSet())
                            wait();
                    } catch (Exception e) {
                        return;
                    }
                }

                dbo.setProp(UploadingFileContract._PROGRESS, progress);
                dbo.setProp(UploadingFileContract._UPLOADED, uploadedBytes);

                UploadingFileModel model = new UploadingFileModel(dbo);
                Response updateResponse = repo.update(model);

                WritableMap map = new WritableNativeMap();
                map.putDouble(UploadingFileContract._FILE_HANDLE, dbo.getId());
                map.putDouble(UploadingFileContract._PROGRESS, progress);
                map.putDouble(UploadingFileContract._UPLOADED, uploadedBytes);

                sendEvent(EVENT_FILE_UPLOADED_PROGRESS, map);

                Intent cancelIntent = new Intent(UploadService.this, UploadService.class);
                cancelIntent.setAction(ACTION_UPLOAD_FILE_CANCEL);
                cancelIntent.putExtra("fileHandle", dbo.getId());

                PendingIntent cancelIntentPending = PendingIntent.getService(UploadService.this, (int)dbo.getId(), cancelIntent,PendingIntent.FLAG_UPDATE_CURRENT);

                final NotificationCompat.Action cancelUploadAction = new NotificationCompat.Action(R.mipmap.ic_launcher, "Cancel", cancelIntentPending);

                mNotificationService.notify((int)dbo.getId(), "Uploading " + dbo.getName(), (int)(progress * 10000), 10000, cancelUploadAction);
                Log.d("UPLOAD DEBUG", "File upload progress: " + Thread.currentThread().getId() + ". Progress: " + progress);
            }

            @Override
            public void onComplete(String filePath, File file) {
                FileRepository fileRepo = new FileRepository(db);
                FileModel model = new FileModel(file);

                long fileHandle = dbo.getId();

                Response deleteResponse = repo.delete(fileHandle);
                Response insertResponse = fileRepo.insert(model);
                db.close();

                WritableMap map = new WritableNativeMap();
                map.putDouble(UploadingFileContract._FILE_HANDLE, fileHandle);
                map.putString(FileContract._FILE_ID, model.getFileId());

                sendEvent(EVENT_FILE_UPLOADED_SUCCESSFULLY, map);
                mNotificationService.notify((int)dbo.getId(), file.getName() + " uploaded succesfully", 0, 0, null);
                Log.d("UPLOAD DEBUG", "File upload completed: " + Thread.currentThread().getId());
            }

            @Override
            public void onError(String filePath, int code, String message) {
                Response deleteResponse = repo.delete(dbo.getId());
                db.close();

                WritableMap map = new WritableNativeMap();

                map.putString("errorMessage", message);
                map.putInt("errorCode", code);
                map.putDouble(UploadingFileContract._FILE_HANDLE, dbo.getId());

                sendEvent(EVENT_FILE_UPLOAD_ERROR, map);
                mNotificationService.notify((int)dbo.getId(), message, 0, 0, null);
                Log.d("UPLOAD DEBUG", "File upload error: " + Thread.currentThread().getId() + ". Error: " + message);
            }
        });

        synchronized (dbo) {
            long threadName = Thread.currentThread().getId();
            dbo.setProp("_id", fileHandle);

            UploadingFileModel model = new UploadingFileModel(dbo);
            Response insertResponse = repo.insert(model);

            if(insertResponse.isSuccess()) {
                WritableMap map = Arguments.createMap();
                //map.putString("fileHandle", String.valueOf(dbo.getId()));
                map.putDouble("fileHandle", dbo.getId());

                sendEvent(EVENT_FILE_UPLOAD_START, map);
            }

            dbo.notifyAll();
        }

        /*while(true) {
            try {
                Thread.currentThread().wait(2000);
            } catch(Exception e) {
                Log.d("SERVICE DEBUG", "alive");
            }
        }*/
    }
}
