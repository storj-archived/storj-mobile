package io.storj.mobile.storjlibmodule.services;

import android.app.Service;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import io.storj.libstorj.File;
import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.FileContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.UploadingFileContract;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.UploadingFileDbo;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.FileRepository;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.UploadingFilesRepository;
import io.storj.mobile.storjlibmodule.enums.DownloadStateEnum;
import io.storj.mobile.storjlibmodule.models.FileModel;
import io.storj.mobile.storjlibmodule.models.UploadingFileModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
import io.storj.mobile.storjlibmodule.utils.ProgressResolver;
import io.storj.mobile.storjlibmodule.utils.ThumbnailProcessor;
import io.storj.mobile.storjlibmodule.utils.Uploader;
import io.storj.mobile.storjlibmodule.utils.WritableMapMapper;

public class UploadService2 extends Service {
    private String mServiceName;

    private Handler mWorkerThreadHandler;
    private Handler mSyncThreadHandler;
    private Handler mCancelThreadHandler;

    public UploadService2() {
        mServiceName = "UploadService";
    }

    private final static String TAG = "UPLOAD SERVICE 2 DEBUG";

    public final static String ACTION_UPLOAD_FILE = "ACTION_UPLOAD_FILE";
    public final static String ACTION_SYNC_FILE = "ACTION_SYNC_FILE";
    public final static String ACTION_CANCEL_UPLOAD = "ACTION_CANCEL_UPLOAD";

    public final static String PARAM_BUCKET_ID = "PARAM_BUCKET_ID";
    public final static String PARAM_FILE_NAME = "PARAM_FILE_NAME";
    public final static String PARAM_LOCAL_PATH = "PARAM_LOCAL_PATH";

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        Log.d(TAG, "onCreate: " + mServiceName);

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
                processIntent(intent, startId, mSyncThreadHandler);
                break;
            case ACTION_CANCEL_UPLOAD:
                processIntent(intent, startId, mCancelThreadHandler);
                break;
        }

        return Service.START_NOT_STICKY;
    }

    private void processIntent(Intent intent, int startId, Handler handler) {
        Message msg = handler.obtainMessage(startId);
        msg.setData(intent.getExtras());
        msg.sendToTarget();
    }

    public class SyncHandler extends Handler {
        public SyncHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {

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

            try(SQLiteDatabase db = new DatabaseFactory(UploadService2.this, null).getWritableDatabase()) {
                Uploader uploader = new Uploader(UploadService2.this, new WorkerUploaderCallback(db, new UploadEventEmitter(getApplicationContext()), false));
                uploader.uploadFile(bucketId, fileName, localPath);
            } catch (Exception e) {
                String message = e.getMessage();
            }
        }

        public class BaseUploaderCallback implements Uploader.Callback {
            private SQLiteDatabase mDb;
            private UploadingFilesRepository mUploadingRepo;
            private ProgressResolver mProgressResolver;
            private UploadingFileDbo mDbo;
            private final Object lock = new Object();

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

        public class BaseEventEmitter {
            protected Context mContext;

            public final static String ACTION_EVENT = "ACTION_EVENT";
            public final static String PARAM_DATA = "data";
            public final static String PARAM_EVENT_NAME = "eventName";

            public BaseEventEmitter(Context context) {
                mContext = context;
            }

            public void Emit(String eventName, ContentValues map) {
                if(mContext == null) {
                    return;
                }

//                ReactContext reactContext = ((ReactApplication)mContext).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
//                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                        .emit(eventName, WritableMapMapper.get(map));

                Intent eventIntent = new Intent(ACTION_EVENT);
                eventIntent.putExtra(PARAM_DATA, map);
                eventIntent.putExtra(PARAM_EVENT_NAME, eventName);

                LocalBroadcastManager.getInstance(mContext).sendBroadcast(eventIntent);
            }
        }

        public class UploadEventEmitter extends BaseEventEmitter implements Uploader.Callback {
            private long mFileHandle;

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
            private Uploader.Callback mEventEmitter;
            private boolean msIsSync;

            public WorkerUploaderCallback(SQLiteDatabase db, Uploader.Callback eventEmitter, boolean isSync) {
                super(db);
                mFileRepo = new FileRepository(db);
                mEventEmitter = eventEmitter;
                msIsSync = isSync;

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
                        msIsSync,
                        DownloadStateEnum.DOWNLOADED.getValue(),
                        localPath,
                        thumbnail);

                mFileRepo.insert(fileModel);
                mEventEmitter.onComplete(localPath, file);
            }

            @Override
            public void onError(String localPath, int code, String message) {
                super.onError(localPath, code, message);
                mEventEmitter.onError(localPath, code, message);
            }
        }
    }

    public class CancelHandler extends Handler {
        public CancelHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {

        }
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.d(TAG, "onTaskRemoved: " + mServiceName);
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy: " + mServiceName);
    }
}
