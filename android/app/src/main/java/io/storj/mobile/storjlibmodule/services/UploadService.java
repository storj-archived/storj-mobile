package io.storj.mobile.storjlibmodule.services;

import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.sqlite.SQLiteDatabase;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.support.annotation.Nullable;
import android.support.v7.app.NotificationCompat;
import android.util.Log;

import io.storj.libstorj.File;
import io.storj.mobile.R;
import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.FileContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.SynchronizationQueueContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.UploadingFileContract;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.SyncQueueEntryDbo;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.UploadingFileDbo;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.FileRepository;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.SyncQueueRepository;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.UploadingFilesRepository;
import io.storj.mobile.storjlibmodule.enums.DownloadStateEnum;
import io.storj.mobile.storjlibmodule.enums.SyncStateEnum;
import io.storj.mobile.storjlibmodule.interfaces.NotificationResolver;
import io.storj.mobile.storjlibmodule.models.FileModel;
import io.storj.mobile.storjlibmodule.models.SyncQueueEntryModel;
import io.storj.mobile.storjlibmodule.models.UploadingFileModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
import io.storj.mobile.storjlibmodule.services.eventemitters.BaseEventEmitter;
import io.storj.mobile.storjlibmodule.services.eventemitters.SynchronizationEventEmitter;
import io.storj.mobile.storjlibmodule.utils.ProgressResolver;
import io.storj.mobile.storjlibmodule.utils.ThumbnailProcessor;
import io.storj.mobile.storjlibmodule.utils.Uploader;

public class UploadService extends Service {
    private String mServiceName;

    private Handler mWorkerThreadHandler;
    private Handler mSyncThreadHandler;
    private Handler mCancelThreadHandler;
    private BroadcastReceiver mBroadcastReceiver;

    public UploadService() {
        mServiceName = "UploadService";
        mBroadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                ConnectivityManager connectivityManager =
                        (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
                NetworkInfo activeNetInfo = connectivityManager.getActiveNetworkInfo();

                if (activeNetInfo != null && activeNetInfo.getType() == ConnectivityManager.TYPE_WIFI) {
                    //WIFI ON
                } else {
                    //WIFI OFF
                }
            }
        };
    }

    private final static String TAG = "UPLOAD_SERVICE_2_DEBUG";

    public final static String ACTION_UPLOAD_FILE = "ACTION_UPLOAD_FILE";
    public final static String ACTION_SYNC_FILE = "ACTION_SYNC_FILE";
    public final static String ACTION_CANCEL_UPLOAD = "ACTION_CANCEL_UPLOAD";
    public final static String ACTION_REMOVE_FROM_SYNC_QUEUE = "ACTION_REMOVE_FROM_SYNC_QUEUE";
    public final static String ACTION_CANCEL_SYNC = "ACTION_CANCEL_SYNC";

    public final static String PARAM_BUCKET_ID = "bucketId";
    public final static String PARAM_FILE_NAME = "fileName";
    public final static String PARAM_LOCAL_PATH = "localPath";
    public final static String PARAM_SYNC_ENTRY_ID = "syncEntryId";
    public final static String PARAM_FILE_HANDLE = "fileHandle";

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        Log.d(TAG, "onCreate: " + mServiceName);
        IntentFilter filters = new IntentFilter();
        filters.addAction("android.net.conn.CONNECTIVITY_CHANGE");
        this.registerReceiver(mBroadcastReceiver, filters);

        HandlerThread workerThread = new HandlerThread("UploadWorkerThread", android.os.Process.THREAD_PRIORITY_BACKGROUND);
        HandlerThread syncThread = new HandlerThread("UploadSyncThread", android.os.Process.THREAD_PRIORITY_BACKGROUND);
        HandlerThread cancelThread = new HandlerThread("UploadCancelThread", android.os.Process.THREAD_PRIORITY_BACKGROUND);

        workerThread.start();
        syncThread.start();
        cancelThread.start();

        mWorkerThreadHandler = new WorkerHandler(workerThread.getLooper());
        mSyncThreadHandler = new SyncHandler(syncThread.getLooper());
        mCancelThreadHandler = new CancelHandler(cancelThread.getLooper());
    }

    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand: " + mServiceName);

        if(intent == null) {
            return Service.START_NOT_STICKY;
        }

        switch(intent.getAction()) {
            case ACTION_UPLOAD_FILE:
                processIntent(intent, startId, mWorkerThreadHandler);
                break;
            case ACTION_SYNC_FILE:
                processIntent(intent, intent.getIntExtra(PARAM_SYNC_ENTRY_ID, -1), mSyncThreadHandler);
                break;
            case ACTION_CANCEL_UPLOAD:
                processIntent(intent, startId, mCancelThreadHandler);
                break;
            case ACTION_REMOVE_FROM_SYNC_QUEUE:
                removeFromSyncQueue(intent.getIntExtra(PARAM_SYNC_ENTRY_ID, -1));
                break;
            case ACTION_CANCEL_SYNC:
                mSyncThreadHandler.removeCallbacksAndMessages(null);
                break;
        }

        return Service.START_NOT_STICKY;
    }

    private Intent getSynchronizationIntent(String action) {
        return new Intent(this, SynchronizationService.class).setAction(action);
    }

    private void removeFromSyncQueue(int id) {
        if(mSyncThreadHandler.hasMessages(id)) {
            mSyncThreadHandler.removeMessages(id);
        }
    }

    private void processIntent(Intent intent, int id, Handler handler) {
        if(id == -1 || handler.hasMessages(id)) {
            return;
        }

        Message msg = handler.obtainMessage(id);
        msg.setData(intent.getExtras());
        msg.sendToTarget();
    }

    public class BaseUploaderCallback implements Uploader.Callback {
        private SQLiteDatabase mDb;
        private UploadingFilesRepository mUploadingRepo;
        private ProgressResolver mProgressResolver;
        private UploadingFileDbo mDbo;
        private final Object lock = new Object();

        protected long mFileHandle;

        public BaseUploaderCallback(SQLiteDatabase db) {
            mDb = db;
            mUploadingRepo = new UploadingFilesRepository(db);
            mProgressResolver = new ProgressResolver();
        }

        @Override
        public void onStart(long fileHandle, String bucketId, String fileName, String localPath) {
            synchronized (lock) {
                mDbo = new UploadingFileDbo(fileHandle, fileName, localPath, bucketId);
            }

            mFileHandle = fileHandle;
            Response response = mUploadingRepo.insert(new UploadingFileModel(mDbo));
        }

        @Override
        public boolean onProgress(String localPath, double progress, long uploadedBytes, long totalBytes) {
            synchronized (lock) {
                if(mDbo == null || !mDbo.isIdSet()) {
                    return false;
                }
            }

            synchronized (mProgressResolver) {
                mProgressResolver.setMProgress(progress);

                if(mProgressResolver.getMProgress() != progress) {
                    return false;
                }

                mDbo.setProp(UploadingFileContract._PROGRESS, mProgressResolver.getMProgress());
                mDbo.setProp(UploadingFileContract._UPLOADED, uploadedBytes);
                mDbo.setProp(UploadingFileContract._SIZE, totalBytes);
            }

            Response response = mUploadingRepo.update(new UploadingFileModel(mDbo));
            return true;
        }

        @Override
        public void onComplete(String localPath, File file) {
            Response response = mUploadingRepo.delete(mDbo.getId());
        }

        @Override
        public void onError(String localPath, int code, String message) {
            Response response = mUploadingRepo.delete(mDbo.getId());
        }
    }

    public class UploadEventEmitter extends BaseEventEmitter implements Uploader.Callback {
        protected long mFileHandle;

        public final static String EVENT_FILE_UPLOAD_START = "EVENT_FILE_UPLOAD_START";
        public final static String EVENT_FILE_UPLOADED_PROGRESS = "EVENT_FILE_UPLOADED_PROGRESS";
        public final static String EVENT_FILE_UPLOADED_SUCCESSFULLY = "EVENT_FILE_UPLOADED_SUCCESSFULLY";
        public final static String EVENT_FILE_UPLOAD_ERROR = "EVENT_FILE_UPLOAD_ERROR";

        public final static String ERROR_MESSAGE = "errorMessage";
        public final static String ERROR_CODE = "errorCode";

        public UploadEventEmitter() {
            super(null);
        }

        public UploadEventEmitter(Context context) {
            super(context);
        }

        @Override
        public void onStart(long fileHandle, String bucketId, String fileName, String localPath) {
            ContentValues map = new ContentValues();
            map.put(UploadingFileContract._FILE_HANDLE, fileHandle);

            mFileHandle = fileHandle;

            Emit(EVENT_FILE_UPLOAD_START, map);
        }

        @Override
        public boolean onProgress(String localPath, double progress, long uploadedBytes, long totalBytes) {
            ContentValues map = new ContentValues();
            map.put(UploadingFileContract._FILE_HANDLE, mFileHandle);
            map.put(UploadingFileContract._PROGRESS, progress);
            map.put(UploadingFileContract._UPLOADED, uploadedBytes);

            Emit(EVENT_FILE_UPLOADED_PROGRESS, map);
            return true;
        }

        @Override
        public void onComplete(String localPath, File file) {
            ContentValues map = new ContentValues();
            map.put(UploadingFileContract._FILE_HANDLE, mFileHandle);
            map.put(FileContract._FILE_ID, file.getId());

            Emit(EVENT_FILE_UPLOADED_SUCCESSFULLY, map);
        }

        @Override
        public void onError(String localPath, int code, String message) {
            ContentValues map = new ContentValues();

            map.put(ERROR_MESSAGE, message);
            map.put(ERROR_CODE, code);
            map.put(UploadingFileContract._FILE_HANDLE, mFileHandle);

            Emit(EVENT_FILE_UPLOAD_ERROR, map);
        }
    }

    public class WorkerUploaderCallback extends BaseUploaderCallback {
        private FileRepository mFileRepo;
        protected Uploader.Callback mEventEmitter;
        protected boolean mIsSync;

        public WorkerUploaderCallback(SQLiteDatabase db, Uploader.Callback eventEmitter, boolean isSync) {
            super(db);
            mFileRepo = new FileRepository(db);
            mEventEmitter = eventEmitter;
            mIsSync = isSync;

            if(eventEmitter == null) {
                mEventEmitter = new UploadEventEmitter();
            }
        }

        @Override
        public void onStart(long fileHandle, String bucketId, String fileName, String localPath) {
            super.onStart(fileHandle, bucketId, fileName, localPath);
            mEventEmitter.onStart(fileHandle, bucketId, fileName, localPath);
        }

        @Override
        public boolean onProgress(String localPath, double progress, long uploadedBytes, long totalBytes) {
            boolean result = super.onProgress(localPath, progress, uploadedBytes, totalBytes);

            if(result) {
                mEventEmitter.onProgress(localPath, progress, uploadedBytes, totalBytes);
            }

            return result;
        }

        @Override
        public void onComplete(String localPath, File file) {
            super.onComplete(localPath, file);

            ThumbnailProcessor tProc = new ThumbnailProcessor(mFileRepo);
            String thumbnail = null;

            if(file.getMimeType().contains("image/")) {
                SingleResponse resp = tProc.getThumbbnail(localPath);

                if(resp.isSuccess())
                    thumbnail = resp.getResult();
            }

            FileModel fileModel = new FileModel(
                    file,
                    mIsSync,
                    DownloadStateEnum.DOWNLOADED.getValue(),
                    localPath,
                    thumbnail);

            Response response = mFileRepo.insert(fileModel);
            mEventEmitter.onComplete(localPath, file);
        }

        @Override
        public void onError(String localPath, int code, String message) {
            super.onError(localPath, code, message);
            mEventEmitter.onError(localPath, code, message);
        }
    }

    public class SyncUploaderCallback extends WorkerUploaderCallback {
        private int mSyncEntryId;
        private SyncQueueRepository mSyncRepo;
        private SyncQueueEntryModel mSyncEntryModel;
        private NotificationService mNotificationService;
        private SynchronizationEventEmitter mSyncEventEmitter;

        public SyncUploaderCallback(SQLiteDatabase db, Uploader.Callback eventEmitter, NotificationService notificationService, int syncEntryId) {
            super(db, eventEmitter, true);
            mSyncEntryId = syncEntryId;
            mSyncRepo = new SyncQueueRepository(db);
            mNotificationService = notificationService;
            mSyncEventEmitter = new SynchronizationEventEmitter((BaseEventEmitter)eventEmitter);
        }

        @Override
        public void onStart(long fileHandle, String bucketId, String fileName, String localPath) {
            super.onStart(fileHandle, bucketId, fileName, localPath);
            mSyncEntryModel = mSyncRepo.get(mSyncEntryId);

            SyncQueueEntryDbo syncEntryDbo = new SyncQueueEntryDbo(mSyncEntryModel);
            syncEntryDbo.setProp(SynchronizationQueueContract._STATUS, SyncStateEnum.PROCESSING.getValue());
            syncEntryDbo.setProp(SynchronizationQueueContract._FILE_HANDLE, fileHandle);

            Response response = mSyncRepo.update(syncEntryDbo.toModel());

            if(response.isSuccess()) {
                mSyncEventEmitter.SyncEntryUpdated(mSyncEntryId);
            }

            mNotificationService.addAction(getNotificationAction("Skip", getCancelUploadIntent()));
            mNotificationService.addAction(getNotificationAction("Cancel", getCancelSyncIntent()));
        }

        @Override
        public boolean onProgress(String localPath, double progress, long uploadedBytes, long totalBytes) {
            if(!super.onProgress(localPath, progress, uploadedBytes, totalBytes)) {
                return false;
            }

            int filesLeftToProcess = mSyncRepo.getActiveCount();
            int totalMb = (int) (totalBytes/1024);
            int uploadedMb = (int) (uploadedBytes/1024);
            String state = "Uploading";

            String message = String.format("%s " + mSyncEntryModel.getFileName() + " %s left", state, filesLeftToProcess);
            String title = "Synchronization";

            mNotificationService.notify(1, message, title, uploadedMb, totalMb);
            return true;
        }

        @Override
        public void onComplete(String localPath, File file) {
            super.onComplete(localPath, file);

            SyncQueueEntryDbo syncEntryDbo = new SyncQueueEntryDbo(mSyncEntryModel);
            syncEntryDbo.setProp(SynchronizationQueueContract._STATUS, SyncStateEnum.PROCESSED.getValue());

            Response response = mSyncRepo.update(syncEntryDbo.toModel());

            if(response.isSuccess()) {
                mSyncEventEmitter.SyncEntryUpdated(mSyncEntryId);
            }
        }

        @Override
        public void onError(String localPath, int code, String message) {
            super.onError(localPath, code, message);

            SyncQueueEntryDbo syncEntryDbo = new SyncQueueEntryDbo(mSyncEntryModel);
            syncEntryDbo.setProp(SynchronizationQueueContract._STATUS, SyncStateEnum.ERROR.getValue());
            syncEntryDbo.setProp(SynchronizationQueueContract._ERROR_CODE, code);

            Response response = mSyncRepo.update(syncEntryDbo.toModel());

            if(response.isSuccess()) {
                mSyncEventEmitter.SyncEntryUpdated(mSyncEntryId);
            }
        }

        private  NotificationCompat.Action getNotificationAction(String title, Intent serviceIntent) {
            return new NotificationCompat.Action(R.mipmap.logo_white, title, getServicePendingIntent(serviceIntent));
        }

        private PendingIntent getServicePendingIntent(Intent serviceIntent) {
            return PendingIntent.getService(getApplicationContext(), 0, serviceIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        }

        private Intent getCancelUploadIntent() {
            Intent cancelUploadIntent = new Intent(getApplicationContext(), UploadService.class);
            cancelUploadIntent.setAction(UploadService.ACTION_CANCEL_UPLOAD);
            cancelUploadIntent.putExtra(UploadService.PARAM_FILE_HANDLE, mFileHandle);

            return cancelUploadIntent;
        }

        private Intent getCancelSyncIntent() {
            return new Intent(getApplicationContext(), SynchronizationService.class).setAction(SynchronizationService.ACTION_SYNC_CANCEL);
        }
    }

    public class SyncHandler extends Handler {
        public SyncHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {
            Bundle data = msg.getData();
            String fileName = data.getString(PARAM_FILE_NAME);
            String localPath = data.getString(PARAM_LOCAL_PATH);
            String bucketId = data.getString(PARAM_BUCKET_ID);
            int syncEntryId = data.getInt(PARAM_SYNC_ENTRY_ID);

            try(SQLiteDatabase db = new DatabaseFactory(UploadService.this, null).getWritableDatabase()) {
                Context context = getApplicationContext();

                NotificationService notificationService = new NotificationService();
                notificationService.init(context, context instanceof NotificationResolver ? (NotificationResolver) context : null);
                SyncUploaderCallback syncUploaderCallback = new SyncUploaderCallback(db, new UploadEventEmitter(context), notificationService, syncEntryId);

                Uploader uploader = new Uploader(UploadService.this, syncUploaderCallback);
                uploader.uploadFile(bucketId, fileName, localPath);
            } catch (Exception e) {
                String message = e.getMessage();
            }
        }
    }

    public class WorkerHandler extends Handler {
        public WorkerHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {
            Bundle data = msg.getData();
            String fileName = data.getString(PARAM_FILE_NAME);
            String localPath = data.getString(PARAM_LOCAL_PATH);
            String bucketId = data.getString(PARAM_BUCKET_ID);

            try(SQLiteDatabase db = new DatabaseFactory(UploadService.this, null).getWritableDatabase()) {
                Uploader uploader = new Uploader(UploadService.this, new WorkerUploaderCallback(db, new UploadEventEmitter(getApplicationContext()), false));
                uploader.uploadFile(bucketId, fileName, localPath);
            } catch (Exception e) {
                String message = e.getMessage();
            }
        }
    }

    public class CancelHandler extends Handler {
        public CancelHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {
            Bundle data = msg.getData();
            long fileHandle = data.getLong(PARAM_FILE_HANDLE);

            try(SQLiteDatabase db = new DatabaseFactory(UploadService.this, null).getWritableDatabase()) {
                UploadingFilesRepository uploadRepo = new UploadingFilesRepository(db);
                UploadingFileModel model = uploadRepo.get(String.valueOf(fileHandle));

                if(model != null) {
                    Uploader uploader = new Uploader(UploadService.this, null);
                    boolean result = uploader.cancelFileUpload(fileHandle);
                }

            } catch (Exception e) {
                String message = e.getMessage();
            }
        }
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.d(TAG, "onTaskRemoved: " + mServiceName);
        this.unregisterReceiver(mBroadcastReceiver);
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy: " + mServiceName);
        this.unregisterReceiver(mBroadcastReceiver);
    }
}
