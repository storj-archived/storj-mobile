package storjlib.services;

import android.content.Intent;
import android.support.annotation.Nullable;

import io.storj.libstorj.DownloadFileCallback;
import io.storj.libstorj.android.StorjAndroid;

/**
 * Created by Yaroslav-Note on 3/13/2018.
 */

public class DownloadService extends BaseReactService {

    public final static String SERVICE_NAME_SHORT = "DownloadService";
    public final static String SERVICE_NAME = "storjlib.services.DownloadService";

    public final static String ACTION_DOWNLOAD_FILE = "ACTION_DOWNLOAD_FILE";
    public final static String ACTION_DOWNLOAD_FILE_CANCEL = "ACTION_DOWNLOAD_FILE_CANCEL";

    public DownloadService() {
        super(SERVICE_NAME_SHORT);
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        if(intent == null) {
            return;
        }

        String action = intent.getAction();
        switch (action) {
            case ACTION_DOWNLOAD_FILE:
                String bucketId = intent.getStringExtra("bucketId");
                String fileId = intent.getStringExtra("fileId");
                String localPath = intent.getStringExtra("localPath");
                downloadFile(bucketId, fileId, localPath);
                break;
        }
    }

    private void downloadFile(String bucketId, String fileId, String localPath) {

        final long fileHandle = StorjAndroid.getInstance(DownloadService.this).downloadFile(bucketId, fileId, localPath, new DownloadFileCallback() {
            @Override
            public void onProgress(String fileId, double progress, long downloadedBytes, long totalBytes) {

            }

            @Override
            public void onComplete(String fileId, String localPath) {

            }

            @Override
            public void onError(String fileId, int code, String message) {

            }
        });
    }
}
