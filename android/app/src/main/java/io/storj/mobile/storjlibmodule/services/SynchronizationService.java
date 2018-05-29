package io.storj.mobile.storjlibmodule.services;

import android.app.ActivityManager;
import android.app.IntentService;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.support.annotation.Nullable;

import java.util.List;

import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.SynchronizationQueueContract;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.SyncQueueEntryDbo;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.SyncQueueRepository;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.UploadingFilesRepository;
import io.storj.mobile.storjlibmodule.enums.SyncStateEnum;
import io.storj.mobile.storjlibmodule.models.SyncQueueEntryModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.services.eventemitters.BaseEventEmitter;
import io.storj.mobile.storjlibmodule.services.eventemitters.SynchronizationEventEmitter;

public class SynchronizationService extends IntentService {
    public final static String SERVICE_NAME = "SynchronizationService";

    public final static String ACTION_SYNC = "ACTION_SYNC";
    public final static String ACTION_REMOVE_FROM_QUEUE = "ACTION_REMOVE_FROM_QUEUE";
    public final static String ACTION_SYNC_CANCEL = "ACTION_SYNC_CANCEL";

    public final static String EVENT_SYNC_ENTRY_UPDATED = "EVENT_SYNC_ENTRY_UPDATED";
    public final static String EVENT_SYNC_STARTED = "EVENT_SYNC_STARTED"; //TODO: Rename to sync list updated

    private SynchronizationEventEmitter mEventEmitter;

    public SynchronizationService() {
        super(SERVICE_NAME);
        mEventEmitter = new SynchronizationEventEmitter(new BaseEventEmitter(this));
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
                break;
            case ACTION_REMOVE_FROM_QUEUE:
                removeFileFromQueue(intent);
                break;
        }
    }

    //DELETE ALL UPLOADING FILES
    //SET PROCESSING AND QUEUE ENTRIES TO IDLE STATE
    public static void clean(Context context) {
        try(SQLiteDatabase db = new DatabaseFactory(context, null).getWritableDatabase()) {
            UploadingFilesRepository uploadRepo = new UploadingFilesRepository(db);
            Response response = uploadRepo.deleteAll();

            SyncQueueRepository syncRepo = new SyncQueueRepository(db);
            List<SyncQueueEntryModel> syncEntries = syncRepo.getAll();

            for(SyncQueueEntryModel syncEntry : syncEntries) {
                if(syncEntry.getStatus() == SyncStateEnum.PROCESSING.getValue() || syncEntry.getStatus() == SyncStateEnum.QUEUED.getValue()) {
                    SyncQueueEntryDbo dbo = new SyncQueueEntryDbo(syncEntry);
                    dbo.setProp(SynchronizationQueueContract._STATUS, SyncStateEnum.IDLE.getValue());

                    Response updateResponse = syncRepo.update(dbo.toModel());
                }
            }
        } catch (Exception e) {

        }
    }

    private void sync(Intent intent) {
        try(SQLiteDatabase db = new DatabaseFactory(this, null).getWritableDatabase()) {
            SyncQueueRepository syncRepo = new SyncQueueRepository(db);

            List<SyncQueueEntryModel> syncEntries = syncRepo.getAll();

            for(SyncQueueEntryModel syncEntry : syncEntries) {
                if(syncEntry.getStatus() == SyncStateEnum.IDLE.getValue()) {
                    SyncQueueEntryDbo dbo = new SyncQueueEntryDbo(syncEntry);
                    dbo.setProp(SynchronizationQueueContract._STATUS, SyncStateEnum.QUEUED.getValue());

                    Response response = syncRepo.update(dbo.toModel());
                    if(response.isSuccess()) {
                        syncFile(syncEntry.getFileName(), syncEntry.getLocalPath(), syncEntry.getBucketId(), syncEntry.getId());
                    }
                }
            }

            mEventEmitter.SyncStarted();
        } catch (Exception e) {

        }
    }

    private void cancelSync(Intent intent) {
        Intent cancelSyncIntent = new Intent(this, UploadService.class);
        cancelSyncIntent.setAction(UploadService.ACTION_CANCEL_SYNC);

        this.startService(cancelSyncIntent);

        try(SQLiteDatabase db = new DatabaseFactory(this, null).getWritableDatabase()){
            SyncQueueRepository syncRepo = new SyncQueueRepository(db);

            List<SyncQueueEntryModel> syncEntries = syncRepo.getAll();

            for(SyncQueueEntryModel syncEntry : syncEntries) {
                if(syncEntry.getStatus() == SyncStateEnum.PROCESSING.getValue()) {
                    cancelFileSync(syncEntry.getFileHandle());
                }

                if(syncEntry.getStatus() == SyncStateEnum.QUEUED.getValue()) {
                    SyncQueueEntryDbo dbo = new SyncQueueEntryDbo(syncEntry);
                    dbo.setProp(SynchronizationQueueContract._STATUS, SyncStateEnum.IDLE.getValue());

                    Response response = syncRepo.update(dbo.toModel());

                    if(response.isSuccess()) {
                        mEventEmitter.SyncEntryUpdated(syncEntry.getId());
                    }
                }
            }

            NotificationService.Clean(this);
        } catch (Exception e) {

        }
    }

    private void syncFile(String fileName, String localPath, String bucketId, int syncEntryId) {
        Intent syncFileIntent = new Intent(this, UploadService.class);
        syncFileIntent.setAction(UploadService.ACTION_SYNC_FILE);
        syncFileIntent.putExtra(UploadService.PARAM_FILE_NAME, fileName);
        syncFileIntent.putExtra(UploadService.PARAM_LOCAL_PATH, localPath);
        syncFileIntent.putExtra(UploadService.PARAM_BUCKET_ID, bucketId);
        syncFileIntent.putExtra(UploadService.PARAM_SYNC_ENTRY_ID, syncEntryId);

        this.startService(syncFileIntent);
    }

    private void cancelFileSync(long fileHandle) {
        if(fileHandle == 0) {
            return;
        }

        Intent syncFileIntent = new Intent(this, UploadService.class);
        syncFileIntent.setAction(UploadService.ACTION_CANCEL_UPLOAD);
        syncFileIntent.putExtra(UploadService.PARAM_FILE_HANDLE, fileHandle);

        this.startService(syncFileIntent);
    }

    private void removeFileFromQueue(Intent intent) {
        int syncEntryId = intent.getIntExtra(UploadService.PARAM_SYNC_ENTRY_ID, -1);

        if(syncEntryId == -1) {
            return;
        }

        try(SQLiteDatabase db = new DatabaseFactory(this, null).getWritableDatabase()) {
            SyncQueueRepository syncRepo = new SyncQueueRepository(db);
            SyncQueueEntryModel model = syncRepo.get(syncEntryId);

            if(model.getStatus() != SyncStateEnum.QUEUED.getValue()) {
                return;
            }

            SyncQueueEntryDbo dbo = new SyncQueueEntryDbo(model);
            dbo.setProp(SynchronizationQueueContract._STATUS, SyncStateEnum.CANCELLED.getValue());

            Response response = syncRepo.update(dbo.toModel());

            if(response.isSuccess()) {
                Intent removeFromSyncQueueIntent = new Intent(this, UploadService.class);
                removeFromSyncQueueIntent.setAction(UploadService.ACTION_REMOVE_FROM_SYNC_QUEUE);
                removeFromSyncQueueIntent.putExtra(UploadService.PARAM_SYNC_ENTRY_ID, syncEntryId);

                this.startService(removeFromSyncQueueIntent);
                mEventEmitter.SyncEntryUpdated(model.getId());
            }
        } catch (Exception e) {
            return;
        }
    }
}
