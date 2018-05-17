package io.storj.mobile.storjlibmodule.utils;

import android.content.Context;

import java.util.concurrent.CountDownLatch;

import io.storj.libstorj.File;
import io.storj.libstorj.UploadFileCallback;
import io.storj.libstorj.android.StorjAndroid;

public class Uploader {
    Context mContext;
    Callback mCallback;

    public Uploader(Context context, Callback callback) {
        mContext = context;
        mCallback = callback;
    }

    public void uploadFile(String bucketId, String fileName, String localPath) throws Exception, InterruptedException, NullPointerException {
        if(mCallback == null) {
            throw new Exception("No callback passed to uploader!");
        }

        final CountDownLatch uploadLatch = new CountDownLatch(1);

        long fileHandle = StorjAndroid.getInstance(mContext).uploadFile(bucketId, fileName, localPath, new UploadFileCallback() {
            @Override
            public void onProgress(String s, double v, long l, long l1) {
                mCallback.onProgress(s, v, l, l1);
            }

            @Override
            public void onComplete(String s, File file) {
                mCallback.onComplete(s, file);
                uploadLatch.countDown();
            }

            @Override
            public void onError(String s, int i, String s1) {
                mCallback.onError(s, i, s1);
                uploadLatch.countDown();
            }
        });

        mCallback.onStart(fileHandle, bucketId, fileName, localPath);
        uploadLatch.await();
    }

    public boolean cancelFileUpload(long uploadState) {
        if(mContext == null) {
            return false;
        }

        return StorjAndroid.getInstance(mContext).cancelUpload(uploadState);
    }

    public interface Callback {
        void onStart(long fileHandle, String bucketId, String fileName, String localPath);
        boolean onProgress(String localPath, double progress, long uploadedBytes, long totalBytes);
        void onComplete(String localPath, File file);
        void onError(String localPath, int code, String message);
    }
}
