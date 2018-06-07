package io.storj.mobile.storjlibmodule.services;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Message;
import android.support.annotation.Nullable;
import android.util.Log;

import io.storj.mobile.storjlibmodule.services.handlers.CancelHandler;
import io.storj.mobile.storjlibmodule.services.handlers.SyncHandler;
import io.storj.mobile.storjlibmodule.services.handlers.WorkerHandler;

public class UploadService extends Service {
    private String mServiceName;

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

    private Handler mWorkerThreadHandler;
    private Handler mSyncThreadHandler;
    private Handler mCancelThreadHandler;

    private BroadcastReceiver mBroadcastReceiver;

    private final static String TAG = "UPLOAD_SERVICE";

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

        HandlerThread syncThread = new HandlerThread("UploadSyncThread", android.os.Process.THREAD_PRIORITY_BACKGROUND);
        HandlerThread workerThread = new HandlerThread("UploadWorkerThread", android.os.Process.THREAD_PRIORITY_BACKGROUND);
        HandlerThread cancelThread = new HandlerThread("UploadCancelThread", android.os.Process.THREAD_PRIORITY_BACKGROUND);

        workerThread.start();
        syncThread.start();
        cancelThread.start();

        mWorkerThreadHandler = new WorkerHandler(workerThread.getLooper(), UploadService.this);
        mSyncThreadHandler = new SyncHandler(syncThread.getLooper(), UploadService.this);
        mCancelThreadHandler = new CancelHandler(cancelThread.getLooper(), UploadService.this);
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

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.d(TAG, "onTaskRemoved: " + mServiceName);
        this.unregisterReceiver(mBroadcastReceiver);
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy: " + mServiceName);

        super.onDestroy();

        this.unregisterReceiver(mBroadcastReceiver);

        mWorkerThreadHandler.getLooper().quitSafely();
        mSyncThreadHandler.getLooper().quitSafely();
        mCancelThreadHandler.getLooper().quitSafely();
    }
}
