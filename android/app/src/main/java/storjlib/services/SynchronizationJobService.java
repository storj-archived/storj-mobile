package storjlib.services;


import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.AsyncTask;
import android.util.Log;

import com.firebase.jobdispatcher.JobParameters;
import com.firebase.jobdispatcher.JobService;

import java.io.File;
import java.util.List;

import storjlib.Models.UploadingFileModel;
import storjlib.dataProvider.DatabaseFactory;
import storjlib.dataProvider.Dbo.FileDbo;
import storjlib.dataProvider.Dbo.UploadingFileDbo;
import storjlib.dataProvider.contracts.FileContract;
import storjlib.dataProvider.contracts.UploadingFileContract;
import storjlib.dataProvider.repositories.FileRepository;
import storjlib.dataProvider.repositories.UploadingFilesRepository;

/**
 * Created by Yaroslav-Note on 3/13/2018.
 */

public class SynchronizationJobService extends JobService {
    private AsyncTask mBackgroundTask;
    private NotificationService mNotificationService = new NotificationService();

    @Override
    public boolean onStartJob(final JobParameters job) {
        mBackgroundTask = new AsyncTask() {
            @Override
            protected Object doInBackground(Object[] objects) {
                syncFolder("/storage/emulated/0/Movies", "12f19c568912d709e51feb2f");
                /*mNotificationService.init(SynchronizationJobService.this);
                mNotificationService.notifyPriorityHigh(21321, "hello");*/
                return null;
            }

            @Override
            protected void onPostExecute(Object o) {
                jobFinished(job, true);
            }
        };
        //syncFolder("/storage/emulated/0/Movies", "12f19c568912d709e51feb2f");
        //jobFinished(job, true);
        mBackgroundTask.execute();
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters job) {
        if(mBackgroundTask != null)
            mBackgroundTask.cancel(true);
        return true;
    }

    private void uploadFile(String bucketId, String uri) {
        Intent uploadIntent = new Intent(this, UploadService.class);
        uploadIntent.setAction(UploadService.ACTION_UPLOAD_FILE);
        uploadIntent.putExtra(UploadService.PARAMS_BUCKET_ID, bucketId);
        uploadIntent.putExtra(UploadService.PARAMS_URI, uri);

        startService(uploadIntent);
    }

    private final static String DEBUG_TAG = "SYNCHRONIZATION DEBUG";
    private void syncFolder(String folderUri, String bucketId) {
        File folder = new File(folderUri);

        if(!folder.exists() || !folder.isDirectory()) {
            return;
        }

        File[] files = folder.listFiles();

        try(SQLiteDatabase db = new DatabaseFactory(this, null).getReadableDatabase()) {
            FileRepository fileRepo = new FileRepository(db);
            UploadingFilesRepository uploadFileRepo = new UploadingFilesRepository(db);

            for(File file : files) {
                if(file.isDirectory()) {
                    continue;
                }

                FileDbo fileDbo = fileRepo.get(file.getName(), FileContract._NAME);
                UploadingFileModel uploadingFileModel = uploadFileRepo.get(file.getName(), UploadingFileContract._NAME);

                if(fileDbo == null && uploadingFileModel == null) {
                    uploadFile(bucketId, file.getPath());
                }
            }
        } catch(Exception e) {
            Log.d(DEBUG_TAG, "sync error: " + e.getMessage());
        }
    }
}
