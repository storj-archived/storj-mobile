package storjlib.services;


import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;

import com.firebase.jobdispatcher.JobParameters;
import com.firebase.jobdispatcher.JobService;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import storjlib.Enum.SyncSettingsEnum;
import storjlib.Models.SettingsModel;
import storjlib.Models.UploadingFileModel;
import storjlib.Responses.Response;
import storjlib.dataProvider.DatabaseFactory;
import storjlib.dataProvider.Dbo.BucketDbo;
import storjlib.dataProvider.Dbo.FileDbo;
import storjlib.dataProvider.Dbo.SettingsDbo;
import storjlib.dataProvider.Dbo.UploadingFileDbo;
import storjlib.dataProvider.contracts.BucketContract;
import storjlib.dataProvider.contracts.FileContract;
import storjlib.dataProvider.contracts.SettingsContract;
import storjlib.dataProvider.contracts.UploadingFileContract;
import storjlib.dataProvider.repositories.BucketRepository;
import storjlib.dataProvider.repositories.FileRepository;
import storjlib.dataProvider.repositories.SettingsRepository;
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
                String settingsId = job.getExtras().getString(SettingsContract._SETTINGS_ID);

                if(settingsId == null) {
                    Log.d(DEBUG_TAG, "sync: " + "No settings Id! Aborting!");
                    return null;
                }

                try(SQLiteDatabase db = new DatabaseFactory(SynchronizationJobService.this, null).getReadableDatabase()) {
                    SettingsRepository settingsRepo = new SettingsRepository(db);
                    SettingsDbo dbo = settingsRepo.get(settingsId);

                    if(dbo == null) {
                        Log.d(DEBUG_TAG, "sync: " + "No settings settings found by specified id!");
                        return null;
                    }

                    BucketRepository bucketRepo = new BucketRepository(db);
                    int syncSettings = dbo.toModel().getSyncSettings();

                    syncFolder(syncSettings, SyncSettingsEnum.SYNC_PHOTOS, bucketRepo, db);
                    syncFolder(syncSettings, SyncSettingsEnum.SYNC_MOVIES, bucketRepo, db);
                    syncFolder(syncSettings, SyncSettingsEnum.SYNC_DOCUMENTS, bucketRepo, db);
                    syncFolder(syncSettings, SyncSettingsEnum.SYNC_MOVIES, bucketRepo, db);

                    settingsRepo.update(settingsId, getDateTime());
                } catch (Exception e) {
                    Log.d(DEBUG_TAG, "sync error: " + e.getMessage());
                }

                return null;
            }

            @Override
            protected void onPostExecute(Object o) {
                jobFinished(job, true);
            }
        };

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
        Log.d(DEBUG_TAG, "sync: " + "sending new intent for " + uri);
        Intent uploadIntent = new Intent(this, UploadService.class);
        uploadIntent.setAction(UploadService.ACTION_UPLOAD_FILE);
        uploadIntent.putExtra(UploadService.PARAMS_BUCKET_ID, bucketId);
        uploadIntent.putExtra(UploadService.PARAMS_URI, uri);
        uploadIntent.putExtra(FileContract._SYNCED, true);

        startService(uploadIntent);
    }

    private final static String DEBUG_TAG = "SYNCHRONIZATION DEBUG";

    private void syncFolder(int syncSettings, SyncSettingsEnum syncEnum, BucketRepository bucketRepo, SQLiteDatabase db) {
        if(syncEnum != SyncSettingsEnum.SYNC_DOCUMENTS
                && syncEnum != SyncSettingsEnum.SYNC_MUSIC
                && syncEnum != SyncSettingsEnum.SYNC_MOVIES
                && syncEnum != SyncSettingsEnum.SYNC_PHOTOS) {
            return;
        }

        if(bucketRepo == null) {
            return;
        }

        int syncValue = syncEnum.getValue();
        String syncFolder = syncEnum.getFolderName();

        BucketDbo dbo = bucketRepo.get(BucketContract._NAME, syncEnum.getFolderName());

        if((syncSettings & syncValue) == syncValue && dbo != null)
            _syncFolder("/storage/emulated/0/" + syncFolder, dbo.getId(), db);
    }

    private void _syncFolder(String folderUri, String bucketId, SQLiteDatabase db) {
        File folder = new File(folderUri);

        if(!folder.exists() || !folder.isDirectory()) {
            Log.d(DEBUG_TAG, "sync: " + "File not exist or is not a directory");
            return;
        }

        File[] files = folder.listFiles();

        FileRepository fileRepo = new FileRepository(db);
        UploadingFilesRepository uploadFileRepo = new UploadingFilesRepository(db);

        for(File file : files) {
            Log.d(DEBUG_TAG, "sync: " + "File, name: " + file.getName());
            if(file.isDirectory()) {
                Log.d(DEBUG_TAG, "sync: " + "File is directory continue");
                continue;
            }

            FileDbo fileDbo = fileRepo.get(file.getName(), FileContract._NAME, bucketId);
            UploadingFileModel uploadingFileModel = uploadFileRepo.get(file.getName(), UploadingFileContract._NAME);

            if(fileDbo == null && uploadingFileModel == null) {
                uploadFile(bucketId, file.getPath());
            }
        }
    }

    private String getDateTime() {
        SimpleDateFormat dateFormat = new SimpleDateFormat(
                "yyyy-MM-dd HH:mm:ss", Locale.getDefault());
        Date date = new Date();
        return dateFormat.format(date);
    }
}
