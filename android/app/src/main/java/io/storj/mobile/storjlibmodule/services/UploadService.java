package io.storj.mobile.storjlibmodule.services;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.sqlite.SQLiteDatabase;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Process;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import io.storj.libstorj.File;
import io.storj.libstorj.UploadFileCallback;
import io.storj.libstorj.android.StorjAndroid;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.SettingsDbo;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.SettingsRepository;
import io.storj.mobile.storjlibmodule.enums.DownloadStateEnum;
import io.storj.mobile.storjlibmodule.enums.SyncSettingsEnum;
import io.storj.mobile.storjlibmodule.models.FileModel;
import io.storj.mobile.storjlibmodule.models.SettingsModel;
import io.storj.mobile.storjlibmodule.models.UploadingFileModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
import io.storj.mobile.storjlibmodule.utils.ProgressResolver;
import io.storj.mobile.storjlibmodule.utils.ThumbnailProcessor;
import io.storj.mobile.storjlibmodule.utils.UploadSyncObject;
import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.UploadingFileDbo;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.FileContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.SettingsContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.UploadingFileContract;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.FileRepository;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.UploadingFilesRepository;

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

    private volatile boolean mCancelationToken = false;

    private final NotificationService mNotificationService = new NotificationService();

    public UploadService() {
        super("UploadService");
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        Log.d("UPLOAD DEBUG", "onHandleIntent: START");
        if(intent == null) {
            return;
        }

        String action = intent.getAction();

        switch(action) {
            case ACTION_UPLOAD_FILE:
                boolean isSync = intent.getBooleanExtra(FileContract._SYNCED, false);
                //int syncSettings = intent.getIntExtra(SettingsContract._SYNC_SETTINGS, 0);
                String settingsId = intent.getStringExtra(SettingsContract._SETTINGS_ID);

                SQLiteDatabase db = new DatabaseFactory(this, null).getWritableDatabase();
                SettingsRepository settingsRepo = new SettingsRepository(db);
                SettingsDbo settingsDbo = settingsRepo.get(settingsId);
                int syncSettings = 0;
                boolean isSyncOn = isSync;

                if(settingsDbo != null) {
                    SettingsModel settingsModel = settingsDbo.toModel();
                    syncSettings = settingsModel.getSyncSettings();
                    isSyncOn = settingsModel.syncStatus();
                }

                boolean onWifi = (syncSettings & SyncSettingsEnum.ON_WIFI.getValue()) == SyncSettingsEnum.ON_WIFI.getValue();
                boolean onCharging = (syncSettings & SyncSettingsEnum.ON_CHARGING.getValue()) == SyncSettingsEnum.ON_CHARGING.getValue();;

                if(!checkConstraints(isSync, onWifi, onCharging, isSyncOn)) {
                    return;
                }

                uploadFile(intent.getStringExtra(PARAMS_BUCKET_ID),
                        intent.getStringExtra(PARAMS_URI), isSync);
                break;
            case ACTION_UPLOAD_FILE_CANCEL:
                long fileHandle = intent.getLongExtra(PARAMS_FILE_HANDLE, -1);
                Log.d("UPLOAD DEBUG", "File upload cancel action: " + Thread.currentThread().getId() + ". Handle: " + fileHandle);
                uploadFileCancel(fileHandle);
                break;
        }
        Log.d("UPLOAD DEBUG", "onHandleIntent: END, " + intent.getStringExtra(PARAMS_URI));
    }

    private boolean checkConstraints(boolean isSync, boolean onWifi, boolean onCharging, boolean isSyncOn) {
        if(!isSync) {
            return true;
        }

        if(!isSyncOn) {
            Log.d("UPLOAD DEBUG", "ABORTING SYNC file uploading due to failing of SYNC_STATUS constraint");
            return false;
        }

        ConnectivityManager connManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo mWifi = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);

        if(onWifi && !mWifi.isConnected()) {
            Log.d("UPLOAD DEBUG", "ABORTING SYNC file uploading due to failing of ON_WIFI constraint");
            return false;
        }

        if(onCharging && !isCharging(this)) {
            Log.d("UPLOAD DEBUG", "ABORTING SYNC file uploading due to failing of ON_CHARGING constraint");
            return false;
        }

        return true;
    }

    private void uploadFileCancel(long fileHandle) {
        if(fileHandle == -1) {
            return;
        }

        StorjAndroid.getInstance(this).cancelUpload(fileHandle);
    }

    private void uploadFile(String bucketId, final String uri, final boolean isSynced) {
        Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
        //Thread.currentThread().setPriority(Thread.MIN_PRIORITY);

        java.io.File file = new java.io.File(uri);

        if(bucketId == null || !file.exists()) {
            return;
        }

        final SQLiteDatabase db = new DatabaseFactory(UploadService.this, null).getWritableDatabase();
        final UploadingFilesRepository repo = new UploadingFilesRepository(db);

        final UploadingFileDbo dbo = new UploadingFileDbo(0, 0, file.getTotalSpace(), 0, file.getName(), uri, bucketId);

        if(dbo == null) {
            return;
        }

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
            }

            @Override
            public void onComplete(String filePath, File file) {
                Log.d("UPLOAD DEBUG", "File upload completed: " + Thread.currentThread().getId());

                FileRepository fileRepo = new FileRepository(db);
                ThumbnailProcessor tProc = new ThumbnailProcessor(fileRepo);

                String thumbnail = null;

                if(file.getMimeType().contains("image/")) {
                    SingleResponse resp = tProc.getThumbbnail(uri);

                    if(resp.isSuccess()) thumbnail = resp.getResult();
                }

                FileModel model = new FileModel(file,
                        false,
                        isSynced,
                        DownloadStateEnum.DOWNLOADED.getValue(),
                        0,
                        uri,
                        thumbnail);

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

    private boolean isCharging(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            BatteryManager batteryManager = (BatteryManager) context.getSystemService(Context.BATTERY_SERVICE);
            return batteryManager.isCharging();
        } else {
            IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent intent = context.registerReceiver(null, filter);
            int status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);

            if (status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL) {
                return true;
            }
        }
        return false;
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
