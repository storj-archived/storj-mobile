package storjlib.utils;

/**
 * Created by Yaroslav-Note on 3/13/2018.
 */

public class UploadSyncObject {
    private boolean isJobFinished;

    public void setJobFinished() {
        isJobFinished = true;
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
}
