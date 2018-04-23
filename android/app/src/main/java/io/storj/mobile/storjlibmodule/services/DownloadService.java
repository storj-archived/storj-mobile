package io.storj.mobile.storjlibmodule.services;

import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.Process;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import io.storj.libstorj.DownloadFileCallback;
import io.storj.libstorj.android.StorjAndroid;
import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.FileContract;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.FileDbo;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.FileRepository;
import io.storj.mobile.storjlibmodule.enums.DownloadStateEnum;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
import io.storj.mobile.storjlibmodule.utils.ProgressResolver;
import io.storj.mobile.storjlibmodule.utils.ThumbnailProcessor;
import io.storj.mobile.storjlibmodule.utils.UploadSyncObject;

/**
 * Created by Yaroslav-Note on 3/13/2018.
 */

public class DownloadService extends BaseReactService {

    public final static String SERVICE_NAME_SHORT = "DownloadService";
    public final static String SERVICE_NAME = ".storjlibmodule.services.DownloadService";

    public final static String ACTION_DOWNLOAD_FILE = "ACTION_DOWNLOAD_FILE";
    public final static String ACTION_COPY_FILE = "ACTION_COPY_FILE";
    public final static String ACTION_DOWNLOAD_FILE_CANCEL = "ACTION_DOWNLOAD_FILE_CANCEL";

    public final static String EVENT_FILE_DOWNLOAD_START = "EVENT_FILE_DOWNLOAD_START";
    public final static String EVENT_FILE_DOWNLOAD_PROGRESS = "EVENT_FILE_DOWNLOAD_PROGRESS";
    public final static String EVENT_FILE_DOWNLOAD_SUCCESS = "EVENT_FILE_DOWNLOAD_SUCCESS";
    public final static String EVENT_FILE_DOWNLOAD_ERROR = "EVENT_FILE_DOWNLOAD_ERROR";

    public final static String PARAMS_BUCKET_ID = "bucketId";
    public final static String PARAMS_TARGET_BUCKET_ID = "targetBucketId";
    public final static String PARAMS_FILE_ID = "fileId";
    public final static String PARAMS_LOCAL_PATH = "localPath";

    private final static String DEBUG_TAG = "DOWNLOAD SERVICE DEBUG";

    public DownloadService() {
        super(SERVICE_NAME_SHORT);
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        Log.d(DEBUG_TAG, "onHandleIntent: START");
        if(intent == null) {
            return;
        }

        String action = intent.getAction();
        String bucketId = intent.getStringExtra(PARAMS_BUCKET_ID);
        String fileId = intent.getStringExtra(PARAMS_FILE_ID);
        String localPath = intent.getStringExtra(PARAMS_LOCAL_PATH);

        switch (action) {
            case ACTION_DOWNLOAD_FILE:
                downloadFile(bucketId, fileId, localPath);
                break;
            case ACTION_COPY_FILE:
                String targetBucketId = intent.getStringExtra(PARAMS_TARGET_BUCKET_ID);

                if(downloadFile(bucketId, fileId, localPath)) {
                    uploadFile(targetBucketId, localPath);
                }

                break;
        }
        Log.d(DEBUG_TAG, "onHandleIntent: END, " + intent.getStringExtra(PARAMS_FILE_ID));
    }

    private void uploadFile(String bucketId, String localPath) {
        Intent uploadIntent = new Intent(this, UploadService.class);
        uploadIntent.setAction(UploadService.ACTION_UPLOAD_FILE);
        uploadIntent.putExtra(UploadService.PARAMS_BUCKET_ID, bucketId);
        uploadIntent.putExtra(UploadService.PARAMS_URI, localPath);

        this.startService(uploadIntent);
    }

    private boolean downloadFile(String bucketId, final String fileId, String localPath) {
        Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
        //Thread.currentThread().setPriority(Thread.MIN_PRIORITY);

        java.io.File file = new java.io.File(localPath);

        if(bucketId == null || fileId == null /*|| !file.exists() || */|| file.isDirectory()) {
            return false;
        }

        final SQLiteDatabase db = new DatabaseFactory(this, null).getWritableDatabase();
        final FileRepository fileRepo = new FileRepository(db);
        final ThumbnailProcessor tProc = new ThumbnailProcessor(fileRepo);

        final FileDbo fileDbo = fileRepo.get(fileId);

        final UploadSyncObject uploadSyncObject = new UploadSyncObject();
        final ProgressResolver progressResolver = new ProgressResolver();

        if(fileDbo == null) {
            return false;
        }

        final long fileHandle = StorjAndroid.getInstance(DownloadService.this).downloadFile(bucketId, fileId, localPath, new DownloadFileCallback() {
            @Override
            public void onProgress(String fileId, double progress, long downloadedBytes, long totalBytes) {
                synchronized (fileDbo) {
                    try {
                        if(!fileDbo.isFileHandleSet())
                            fileDbo.wait();
                    } catch(Exception e) {

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

                WritableMap map = new WritableNativeMap();
                map.putString(FileContract._FILE_ID, fileId);
                map.putDouble(FileContract._FILE_HANDLE, fileDbo.getFileHandle());
                map.putDouble("progress", _progress);

                sendEvent(EVENT_FILE_DOWNLOAD_PROGRESS, map);
            }

            @Override
            public void onComplete(String fileId, String localPath) {
                if(fileRepo.update(fileId, DownloadStateEnum.DOWNLOADED.getValue(), 0, localPath).isSuccess()) {
                    WritableMap map = new WritableNativeMap();
                    map.putString(FileContract._FILE_ID, fileId);
                    map.putString("localPath", localPath);

                    if(fileDbo.toModel().getMimeType().contains("image/")) {
                        SingleResponse resp = tProc.getThumbbnail(fileId, localPath);

                        if(resp.isSuccess()) {
                            map.putString(FileContract._FILE_THUMBNAIL, resp.getResult());
                        }
                    }

                    sendEvent(EVENT_FILE_DOWNLOAD_SUCCESS, map);
                }

                db.close();
                synchronized(uploadSyncObject) {
                    uploadSyncObject.setJobFinishedSuccess();
                }
            }

            @Override
            public void onError(String fileId, int code, String message) {
                if(fileRepo.update(fileId, DownloadStateEnum.DEFAULT.getValue(), 0, null).isSuccess()) {
                    WritableMap map = new WritableNativeMap();
                    map.putString(FileContract._FILE_ID, fileId);
                    map.putString("errorMessage", message);
                    map.putInt("errorCode", code);

                    sendEvent(EVENT_FILE_DOWNLOAD_ERROR, map);
                }

                db.close();
                synchronized(uploadSyncObject) {
                    uploadSyncObject.setJobFinished();
                }
            }
        });

        synchronized(fileDbo) {
            fileDbo.setProp(FileContract._FILE_HANDLE, fileHandle);

            if(fileRepo.update(fileId, DownloadStateEnum.DOWNLOADING.getValue(), fileHandle, null).isSuccess()) {
                WritableMap map = new WritableNativeMap();
                map.putString(FileContract._FILE_ID, fileId);
                map.putDouble(FileContract._FILE_HANDLE, fileHandle);

                sendEvent(EVENT_FILE_DOWNLOAD_START, map);
            }

            fileDbo.notifyAll();
        }

        synchronized(uploadSyncObject) {
            uploadSyncObject.isJobFinished();
            return uploadSyncObject.isSuccess();
        }
    }
}
