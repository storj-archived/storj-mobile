package io.storj.mobile.storjlibmodule.utils;

/**
 * Created by Yaroslav-Note on 3/13/2018.
 */

public class UploadSyncObject {
    private boolean isJobFinished;
    private boolean isSuccess;

    public void setJobFinished() {
        isJobFinished = true;
        notify();
    }

    public void setJobFinishedSuccess() {
        isJobFinished = true;
        isSuccess = true;
        notify();
    }

    public synchronized boolean isJobFinished() {
        try {
            while(!isJobFinished) {
                wait();
            }
        } catch (Exception e) {

        }

        return isJobFinished;
    }

    public boolean isSuccess() {
        return isSuccess;
    }
}
