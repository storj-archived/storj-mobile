package io.storj.mobile.storjlibmodule.services;

import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.Process;
import android.support.annotation.Nullable;
import android.util.Log;

import java.util.List;

import io.storj.libstorj.CreateBucketCallback;
import io.storj.libstorj.DeleteBucketCallback;
import io.storj.libstorj.DeleteFileCallback;
import io.storj.libstorj.Storj;
import io.storj.mobile.storjlibmodule.models.BucketModel;
import io.storj.mobile.storjlibmodule.models.FileDeleteModel;
import io.storj.mobile.storjlibmodule.models.FileModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.BucketDbo;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.FileDbo;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.BucketRepository;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.FileRepository;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.File;
import io.storj.libstorj.GetBucketsCallback;
import io.storj.libstorj.ListFilesCallback;
import io.storj.libstorj.android.StorjAndroid;

import static io.storj.mobile.storjlibmodule.services.ServiceModule.GET_BUCKETS;
import static io.storj.mobile.storjlibmodule.services.ServiceModule.GET_FILES;
import static io.storj.mobile.storjlibmodule.services.ServiceModule.BUCKET_CREATED;
import static io.storj.mobile.storjlibmodule.services.ServiceModule.BUCKET_DELETED;
import static io.storj.mobile.storjlibmodule.services.ServiceModule.FILE_DELETED;

/**
 * Created by Yaroslav-Note on 3/6/2018.
 */

public class FetchService extends BaseReactService {

    public final static String SERVICE_NAME_SHORT = "FetchService";
    public final static String SERVICE_NAME = "io.storj.mobile.storjlibmodule.services.FetchService";

    private final static String EVENT_BUCKETS_UPDATED = "EVENT_BUCKETS_UPDATED";
    private final static String EVENT_FILES_UPDATED = "EVENT_FILES_UPDATED";
    private final static String EVENT_BUCKET_CREATED = "EVENT_BUCKET_CREATED";
    private final static String EVENT_BUCKET_DELETED = "EVENT_BUCKET_DELETED";
    private final static String EVENT_FILE_DELETED = "EVENT_FILE_DELETED";

    private DatabaseFactory _dbFactory;

    public SQLiteDatabase getDb() {
        if(_dbFactory == null) {
            _dbFactory = new DatabaseFactory(FetchService.this, null);
        }

        return _dbFactory.getWritableDatabase();
    }

    public BucketRepository bRepository() {
        return new BucketRepository(getDb());// _bRepository;
    }

    public FileRepository fRepository() {
        return new FileRepository(getDb());
    }
    /**
     * Creates an IntentService.  Invoked by your subclass's constructor.
     */
    public FetchService() {
        super("FetchService");
    }

    private static final String TAG = "INTENT GET BUCKETS";
    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        Log.d(TAG, "onHandleIntent: pn begin");

        if(intent == null) {
            Log.d(TAG, "onHandleIntent: Intent is null");
        }

        String action = intent.getAction();
        Log.d(TAG, "onHandleIntent: " + action);

        switch(action) {
            case GET_BUCKETS:
                getBuckets();
                break;
            case GET_FILES:
                getFiles(intent.getStringExtra("bucketId"));
                break;
            case BUCKET_CREATED:
                createBucket(intent.getStringExtra("bucketName"));
                break;
            case BUCKET_DELETED:
                deleteBucket(intent.getStringExtra("bucketId"));
                break;
            case FILE_DELETED:
                deleteFile(intent.getStringExtra("bucketId"), intent.getStringExtra("fileId"));
                break;
        }

        Log.d(TAG, "onHandleIntentEND: " + action);
    }

    private void getBuckets() {
        if(Process.getThreadPriority(0) != Process.THREAD_PRIORITY_BACKGROUND) {
            Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
        }

        getInstance().getBuckets(new GetBucketsCallback() {
            @Override
            public void onBucketsReceived(Bucket[] buckets) {
                if(buckets == null) {
                    return;
                }

                if(buckets.length == 0) {
                    bRepository().deleteAll();
                    getDb().close();
                    sendEvent(EVENT_BUCKETS_UPDATED, true);
                    return;
                }

                getDb().beginTransaction();

                try {
                    List<BucketDbo> bucketDbos = bRepository().getAll();

                    int length = buckets.length;

                    outer:
                    for(BucketDbo bucketDbo : bucketDbos) {
                        int i = 0;
                        String dboId = bucketDbo.getId();

                        do {
                            Bucket bucket = buckets[i];
                            String id = bucket.getId();

                            if(dboId.equals(id)) {
                                Response updateResponse = bRepository().update(new BucketModel(bucket));
                                arrayShift(buckets, i, length);
                                length--;
                                continue outer;
                            }

                            i++;
                        } while(i < length);

                        Response deleteResponse = bRepository().delete(dboId);
                    }

                    for(int i = 0; i < length; i ++) {
                        Response bucketInsertResponse = bRepository().insert(new BucketModel(buckets[i]));
                    }

                    getDb().setTransactionSuccessful();
                } catch (Exception e) {
                    new String("sdasd").equals("dasd");
                } finally {
                    getDb().endTransaction();
                    getDb().close();
                }

                sendEvent(EVENT_BUCKETS_UPDATED, true);
            }

            @Override
            public void onError(int code, String message) {
                sendEvent(EVENT_BUCKETS_UPDATED, false);
            }
        });
    }

    private void getFiles(final String bucketId) {
        getInstance().listFiles(bucketId, new ListFilesCallback() {
            @Override
            public void onFilesReceived(String bucketId, File[] files) {
                if(files == null) {
                    return;
                }

                if(files.length == 0) {
                    Response deleteAllResponse = fRepository().deleteAll(bucketId);
                    getDb().close();
                    sendEvent(EVENT_FILES_UPDATED, new SingleResponse(true, bucketId, null).toWritableMap());
                    return;
                }

                getDb().beginTransaction();

                try {
                    List<FileDbo> fileDbos = fRepository().getAll(bucketId);

                    int length = files.length;
                    boolean[] isUpdate = new boolean[files.length];

                    outer:
                    for(FileDbo fileDbo : fileDbos) {
                        int i = 0;
                        String dboId = fileDbo.getId();

                        do {
                            File file = files[i];
                            String id = file.getId();

                            if(dboId.equals(id)) {
                                fRepository().update(new FileModel(file));
                                arrayShift(files, i, length);
                                length--;
                                continue outer;
                            }

                            i++;
                        } while(i < length);

                        fRepository().delete(dboId);
                    }

                    for(int i = 0; i < length; i ++) {
                        fRepository().insert(new FileModel(files[i]));
                    }

                    getDb().setTransactionSuccessful();
                } catch (Exception e) {
                    String s = e.getMessage();
                } finally {
                    getDb().endTransaction();
                    getDb().close();
                }

                sendEvent(EVENT_FILES_UPDATED, new SingleResponse(true, bucketId, null).toWritableMap());
            }

            @Override
            public void onError(String bucketId, int code, String message) {
                sendEvent(EVENT_FILES_UPDATED, new SingleResponse(false, bucketId, message).toWritableMap());
            }
        });
    }

    private void createBucket(final String bucketName) {
        getInstance().createBucket(bucketName, new CreateBucketCallback() {
            @Override
            public void onBucketCreated(Bucket bucket) {
                Response insertionResponse = bRepository().insert(new BucketModel(bucket));

                if(mContext == null) {
                    return;
                }

                if(insertionResponse.isSuccess()) {
                    sendEvent(EVENT_BUCKET_CREATED, new SingleResponse(true,
                            toJson(new BucketModel(bucket)), null).toWritableMap());
                    return;
                }

                sendEvent(EVENT_BUCKET_CREATED, new Response(false, "Bucket insertion to db failed").toWritableMap());
            }

            @Override
            public void onError(String bucketName, int code, String message) {
                if(mContext == null) {
                    return;
                }

                sendEvent(EVENT_BUCKET_CREATED, new Response(false, message, code).toWritableMap());
            }
        });
    }

    private void deleteBucket(final String bucketId) {
        getInstance().deleteBucket(bucketId, new DeleteBucketCallback() {
            @Override
            public void onBucketDeleted(String bucketId) {
                Response deletionResponse = bRepository().delete(bucketId);

                if(mContext == null) {
                    return;
                }

                if(deletionResponse.isSuccess()){
                    sendEvent(EVENT_BUCKET_DELETED, new SingleResponse(true, bucketId,null).toWritableMap());
                    return;
                }

                sendEvent(EVENT_BUCKET_DELETED, new Response(false, "Bucket deletion failed in db").toWritableMap());
            }

            @Override
            public void onError(String bucketId, int code, String message) {
                if(mContext == null) {
                    return;
                }

                sendEvent(EVENT_BUCKET_DELETED, new Response(false, message, code).toWritableMap());
            }
        });
    }

    private void deleteFile(final String bucketId, final String fileId) {
        getInstance().deleteFile(bucketId, fileId, new DeleteFileCallback() {
            @Override
            public void onFileDeleted(String fileId) {
                Response deletionResponse = fRepository().delete(fileId);

                if(mContext == null) {
                    return;
                }

                if(deletionResponse.isSuccess()){
                    sendEvent(EVENT_FILE_DELETED, new SingleResponse(true, toJson(new FileDeleteModel(bucketId, fileId)), null).toWritableMap());
                    return;
                }

                sendEvent(EVENT_FILE_DELETED, new Response(false, "File deletion failed in db").toWritableMap());
            }

            @Override
            public void onError(String fileId, int code, String message) {
                if(mContext == null) {
                    return;
                }

                sendEvent(EVENT_FILE_DELETED, new Response(false, message, code).toWritableMap());
            }
        });
    }

    private <T> void arrayShift(T[] array, int pos, int length) {
        while(pos < length - 1) {
            array[pos] = array[pos + 1];
            pos++;
        }
    }

    private Storj getInstance() {
        return StorjAndroid.getInstance(this);
    }
}
