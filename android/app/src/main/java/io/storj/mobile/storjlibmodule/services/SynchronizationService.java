package io.storj.mobile.storjlibmodule.services;

import android.app.IntentService;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.support.annotation.Nullable;

import java.util.List;

import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.SyncQueueRepository;
import io.storj.mobile.storjlibmodule.enums.SyncStateEnum;
import io.storj.mobile.storjlibmodule.models.SyncQueueEntryModel;

public class SynchronizationService extends IntentService {
    public final static String SERVICE_NAME = "SynchronizationService";

    public final static String ACTION_SYNC = "ACTION_SYNC";
    public final static String ACTION_SYNC_CANCEL = "ACTION_SYNC_CANCEL";

    public SynchronizationService() {
        super(SERVICE_NAME);
    }

    public SynchronizationService(String name) {
        super(name);
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        if(intent == null) {
            return;
        }

        switch(intent.getAction()) {
            case ACTION_SYNC:
                sync(intent);
                break;
            case ACTION_SYNC_CANCEL:
                cancelSync(intent);
        }
    }

    private void sync(Intent intent) {
        try(SQLiteDatabase db = new DatabaseFactory(this, null).getWritableDatabase()){
            SyncQueueRepository syncRepo = new SyncQueueRepository(db);

            List<SyncQueueEntryModel> syncEntries = syncRepo.getAll();

            for(SyncQueueEntryModel syncEntry : syncEntries) {
                if(syncEntry.getStatus() == SyncStateEnum.QUEUED.getValue()) {
                    syncFile(syncEntry.getFileName(), syncEntry.getLocalPath(), syncEntry.getBucketId(), syncEntry.getId());
                }
            }
        } catch (Exception e) {

        }
    }

    private void cancelSync(Intent intent) {
        Intent cancelSyncIntent = new Intent(this, UploadService2.class);
        cancelSyncIntent.setAction(UploadService2.ACTION_CANCEL_SYNC);

        this.startService(cancelSyncIntent);

        try(SQLiteDatabase db = new DatabaseFactory(this, null).getWritableDatabase()){
            SyncQueueRepository syncRepo = new SyncQueueRepository(db);

            List<SyncQueueEntryModel> syncEntries = syncRepo.getAll();

            for(SyncQueueEntryModel syncEntry : syncEntries) {
                if(syncEntry.getStatus() == SyncStateEnum.PROCESSING.getValue()) {
                    cancelFileSync(syncEntry.getFileHandle());
                }
            }
        } catch (Exception e) {

        }
    }

    private void syncFile(String fileName, String localPath, String bucketId, int syncEntryId) {
        Intent syncFileIntent = new Intent(this, UploadService2.class);
        syncFileIntent.setAction(UploadService2.ACTION_SYNC_FILE);

        syncFileIntent.putExtra(UploadService2.PARAM_FILE_NAME, fileName);
        syncFileIntent.putExtra(UploadService2.PARAM_LOCAL_PATH, localPath);
        syncFileIntent.putExtra(UploadService2.PARAM_BUCKET_ID, bucketId);
        syncFileIntent.putExtra(UploadService2.PARAM_SYNC_ENTRY_ID, syncEntryId);

        this.startService(syncFileIntent);
    }

    private void cancelFileSync(long fileHandle) {
        if(fileHandle == 0) {
            return;
        }

        Intent syncFileIntent = new Intent(this, UploadService2.class);
        syncFileIntent.setAction(UploadService2.ACTION_CANCEL_UPLOAD);

        syncFileIntent.putExtra(UploadService2.PARAM_FILE_HANDLE, fileHandle);

        this.startService(syncFileIntent);
    }
}
