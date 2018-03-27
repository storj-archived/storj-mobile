package storjlib.services;

import android.app.PendingIntent;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.Process;
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
import storjlib.Utils.ProgressResolver;
import storjlib.Utils.UploadSyncObject;
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

    public final static String PARAMS_BUCKET_ID = "bucketId";
    public final static String PARAMS_URI = "uri";
    public final static String PARAMS_FILE_HANDLE = "fileHandle";

    public final static int UPLOAD_CANCEL_REQUEST_CODE = 223132;

    private final NotificationService mNotificationService = new NotificationService();

    public UploadService() {
        super("UploadService");
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        String action = intent.getAction();

        switch(action) {
            case ACTION_UPLOAD_FILE:
                uploadFile(intent.getStringExtra(PARAMS_BUCKET_ID),
                        intent.getStringExtra(PARAMS_URI), intent.getBooleanExtra(FileContract._SYNCED, false));
                break;
            case ACTION_UPLOAD_FILE_CANCEL:
                long fileHandle = intent.getLongExtra(PARAMS_FILE_HANDLE, -1);
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

    private void uploadFile(String bucketId, String uri, final boolean isSynced) {
        Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
        //Thread.currentThread().setPriority(Thread.MIN_PRIORITY);

        java.io.File file = new java.io.File(uri);

        if(bucketId == null || !file.exists()) {
            return;
        }
        final SQLiteDatabase db = new DatabaseFactory(UploadService.this, null).getWritableDatabase();
        final UploadingFilesRepository repo = new UploadingFilesRepository(db);

        final UploadingFileDbo dbo = new UploadingFileDbo(0, 0, file.getTotalSpace(), 0, file.getName(), uri, bucketId);

        final UploadSyncObject syncObj = new UploadSyncObject();
        final ProgressResolver progressResolver = new ProgressResolver();

        mNotificationService.init(this);

        Log.d("HANDLER DEBUG", "File upload call: " + Thread.currentThread().getId() + " , name: " + Thread.currentThread().getName() + ". Uri: " + uri);
        final long fileHandle = StorjAndroid.getInstance(getApplicationContext()).uploadFile(bucketId, uri, new UploadFileCallback() {
            @Override
            public void onProgress(String filePath, double progress, long uploadedBytes, long totalBytes) {
                if(Process.getThreadPriority(0) != Process.THREAD_PRIORITY_BACKGROUND)
                    Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);

                synchronized (dbo) {
                    try {
                        Thread threadName = Thread.currentThread();
                        if(!dbo.isIdSet())
                            dbo.wait();
                    } catch (Exception e) {
                        return;
                    }
                }

                double _progress;

                synchronized (progressResolver) {
                    progressResolver.setMProgress(progress);
                    _progress = progressResolver.getMProgress();

                    if(_progress != progress) {
                        return;
                    }
                }

                Log.d("UPLOAD DEBUG", "File upload progress: " + Thread.currentThread().getId() + " , name: " + Thread.currentThread().getName() + ". Progress: " + progress);

                dbo.setProp(UploadingFileContract._PROGRESS, _progress);
                dbo.setProp(UploadingFileContract._UPLOADED, uploadedBytes);

                UploadingFileModel model = new UploadingFileModel(dbo);
                Response updateResponse = repo.update(model);

                WritableMap map = new WritableNativeMap();
                map.putDouble(UploadingFileContract._FILE_HANDLE, dbo.getId());
                map.putDouble(UploadingFileContract._PROGRESS, _progress);
                map.putDouble(UploadingFileContract._UPLOADED, uploadedBytes);

                sendEvent(EVENT_FILE_UPLOADED_PROGRESS, map);

                /*Intent cancelIntent = new Intent(UploadService.this, UploadService.class);
                cancelIntent.setAction(ACTION_UPLOAD_FILE_CANCEL);
                cancelIntent.putExtra("fileHandle", dbo.getId());

                PendingIntent cancelIntentPending = PendingIntent.getService(UploadService.this, (int)dbo.getId(), cancelIntent,PendingIntent.FLAG_UPDATE_CURRENT);

                final NotificationCompat.Action cancelUploadAction = new NotificationCompat.Action(R.mipmap.ic_launcher, "Cancel", cancelIntentPending);*/

                mNotificationService.notify((int)dbo.getId(), "Uploading " + dbo.getName(), (int)(_progress * 10000), 10000/*, cancelUploadAction*/);

                /*try {
                    Thread.sleep((long)100);
                } catch(Exception e) {

                }*/
            }

            @Override
            public void onComplete(String filePath, File file) {
                Log.d("UPLOAD DEBUG", "File upload completed: " + Thread.currentThread().getId());

                FileRepository fileRepo = new FileRepository(db);
                FileModel model = new FileModel(file, false, isSynced);

                long fileHandle = dbo.getId();

                Response deleteResponse = repo.delete(fileHandle);
                Response insertResponse = fileRepo.insert(model);
                db.close();

                if(deleteResponse.isSuccess() && insertResponse.isSuccess()) {
                    WritableMap map = new WritableNativeMap();
                    map.putDouble(UploadingFileContract._FILE_HANDLE, fileHandle);
                    map.putString(FileContract._FILE_ID, model.getFileId());

                    sendEvent(EVENT_FILE_UPLOADED_SUCCESSFULLY, map);
                    mNotificationService.notify((int)dbo.getId(), file.getName() + " uploaded succesfully", 0, 0/*, null*/);
                } else {
                    Log.d("UPLOAD DEBUG", "uploaded succesfully: " + Thread.currentThread().getId() +
                            ". COULDN'T DELETE ENTRY, ERROR DELETE: " +
                            deleteResponse.getError().getMessage() +
                            ". ERROR INSERT: " +
                            insertResponse.getError().getMessage());
                }

                synchronized (syncObj) {
                    syncObj.setJobFinished();
                }
            }

            @Override
            public void onError(String filePath, int code, String message) {
                Log.d("UPLOAD DEBUG", "File upload error: " + Thread.currentThread().getId() + ". Error: " + message);

                Response deleteResponse = repo.delete(dbo.getId());
                db.close();

                if(deleteResponse.isSuccess()) {
                    WritableMap map = new WritableNativeMap();

                    map.putString("errorMessage", message);
                    map.putInt("errorCode", code);
                    map.putDouble(UploadingFileContract._FILE_HANDLE, dbo.getId());

                    sendEvent(EVENT_FILE_UPLOAD_ERROR, map);
                    mNotificationService.notify((int)dbo.getId(), message, 0, 0/*, null*/);
                } else {
                    Log.d("UPLOAD DEBUG", "File upload error: " + Thread.currentThread().getId() +
                            ". COULDN'T DELETE UPLOADDING FILE ENTRY, ERROR: " +
                            deleteResponse.getError().getMessage());
                }

                synchronized (syncObj) {
                    syncObj.setJobFinished();
                }
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

        synchronized (syncObj) {
            syncObj.isJobFinished();
        }
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        try(SQLiteDatabase db = new DatabaseFactory(this, null).getWritableDatabase()) {
            UploadingFilesRepository uploadRepo = new UploadingFilesRepository(db);
            Response deleteAllResponse = uploadRepo.deleteAll();
            Log.d("APPLICATION DEBUG", "onTaskRemoved: isSuccess " + deleteAllResponse.isSuccess());
        } catch(Exception e) {
            Log.d("APPLICATION DEBUG", "onTaskRemoved: error" + e.getMessage());
        }

        super.onTaskRemoved(rootIntent);
    }
}
