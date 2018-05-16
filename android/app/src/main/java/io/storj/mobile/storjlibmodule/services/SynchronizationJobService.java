package io.storj.mobile.storjlibmodule.services;

import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.AsyncTask;
import android.util.Log;

import com.firebase.jobdispatcher.JobParameters;
import com.firebase.jobdispatcher.JobService;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.BucketContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.FileContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.SettingsContract;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.UploadingFileContract;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.BucketDbo;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.FileDbo;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.SettingsDbo;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.BucketRepository;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.FileRepository;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.SettingsRepository;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.UploadingFilesRepository;
import io.storj.mobile.storjlibmodule.enums.SyncSettingsEnum;
import io.storj.mobile.storjlibmodule.models.UploadingFileModel;

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

                    syncFolder(settingsId, syncSettings, SyncSettingsEnum.SYNC_PHOTOS, bucketRepo, db);
                    syncFolder(settingsId, syncSettings, SyncSettingsEnum.SYNC_MOVIES, bucketRepo, db);
                    syncFolder(settingsId, syncSettings, SyncSettingsEnum.SYNC_DOCUMENTS, bucketRepo, db);
                    syncFolder(settingsId, syncSettings, SyncSettingsEnum.SYNC_MUSIC, bucketRepo, db);

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

    private final static String DEBUG_TAG = "SYNCHRONIZATION DEBUG";

    private void syncFolder(String settingsId, int syncSettings, SyncSettingsEnum syncEnum, BucketRepository bucketRepo, SQLiteDatabase db) {
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
        String bucketName = syncEnum.getBucketName();

        BucketDbo dbo = bucketRepo.get(BucketContract._NAME, bucketName);
        boolean dboIsNotNull = dbo != null;
        boolean isSyncOn = (syncSettings & syncValue) == syncValue;

        if(isSyncOn && dboIsNotNull)
            _syncFolder(syncEnum.geetFolderUri(), dbo.getId(), settingsId, syncSettings, db);
        else
            Log.d(DEBUG_TAG, "sync: " + "Settings for " + bucketName + " - " + " Dbo: " + dboIsNotNull + ", Sync settings: " + isSyncOn);
    }

    private void _syncFolder(String folderUri, String bucketId, String settingsId, int syncSettings, SQLiteDatabase db) {
        Log.d(DEBUG_TAG, "sync: " + "Start sync of " + folderUri + " and " + bucketId);
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
                uploadFile(bucketId, file.getPath(), settingsId, syncSettings);
            }
        }
    }

    private void uploadFile(String bucketId, String uri, String settingsId, int syncSettings) {
        Log.d(DEBUG_TAG, "sync: " + "sending new intent for " + uri);
        Intent uploadIntent = new Intent(this, UploadService.class);
        uploadIntent.setAction(UploadService.ACTION_UPLOAD_FILE);
        uploadIntent.putExtra(UploadService.PARAMS_BUCKET_ID, bucketId);
        uploadIntent.putExtra(UploadService.PARAMS_URI, uri);
        uploadIntent.putExtra(FileContract._SYNCED, true);
        uploadIntent.putExtra(SettingsContract._SYNC_SETTINGS, syncSettings);
        uploadIntent.putExtra(SettingsContract._SETTINGS_ID, settingsId);

        startService(uploadIntent);
    }

    private String getDateTime() {
        SimpleDateFormat dateFormat = new SimpleDateFormat(
                "yyyy-MM-dd HH:mm:ss", Locale.getDefault());
        Date date = new Date();
        return dateFormat.format(date);
    }
}
