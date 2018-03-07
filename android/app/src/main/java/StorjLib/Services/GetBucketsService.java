package StorjLib.Services;

import android.app.IntentService;
import android.app.usage.NetworkStats;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;
import java.util.List;

import StorjLib.GsonSingle;
import StorjLib.Models.BucketModel;
import StorjLib.Models.FileModel;
import StorjLib.Responses.Response;
import StorjLib.dataProvider.DatabaseFactory;
import StorjLib.dataProvider.Dbo.BucketDbo;
import StorjLib.dataProvider.Dbo.FileDbo;
import StorjLib.dataProvider.repositories.BucketRepository;
import StorjLib.dataProvider.repositories.FileRepository;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.File;
import io.storj.libstorj.GetBucketsCallback;
import io.storj.libstorj.ListFilesCallback;
import io.storj.libstorj.android.StorjAndroid;

import static StorjLib.Services.ServiceModule.GET_BUCKETS;
import static StorjLib.Services.ServiceModule.GET_FILES;

/**
 * Created by Yaroslav-Note on 3/6/2018.
 */

public class GetBucketsService extends IntentService {

    private final static String EVENT_BUCKETS_UPDATED = "EVENT_BUCKETS_UPDATED";
    private final static String EVENT_FILES_UPDATED = "EVENT_FILES_UPDATED";

    private Bucket[] _buckets;
    private File[] _files;
    private ReactContext mContext;
    private IBinder mBinder = new GetBucketsServiceBinder();
    /**
     * Creates an IntentService.  Invoked by your subclass's constructor.
     */
    public GetBucketsService() {
        super("GetBucketsService");
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        String action = intent.getAction();

        switch(action) {
            case GET_BUCKETS:
                getBuckets();
                break;
            case GET_FILES:
                getFiles(intent.getStringExtra("bucketId"));
                break;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    private void getBuckets() {
        StorjAndroid.getInstance(this).getBuckets(new GetBucketsCallback() {
            @Override
            public void onBucketsReceived(Bucket[] buckets) {
                _buckets = buckets;

                if(buckets == null) {
                    return;
                }

                SQLiteDatabase db = new DatabaseFactory(GetBucketsService.this, null).getWritableDatabase();
                BucketRepository bucketRepository = new BucketRepository(db);

                db.beginTransaction();

                try {
                    List<BucketDbo> bucketDbos = bucketRepository.getAll();

                    int length = buckets.length;
                    boolean[] isUpdate = new boolean[buckets.length];

                    outer:
                    for(BucketDbo bucketDbo : bucketDbos) {
                        int i = 0;
                        String dboId = bucketDbo.getId();

                        do {
                            Bucket bucket = buckets[i];
                            String id = bucket.getId();

                            if(dboId == id) {
                                //isUpdate[i] = true;
                                bucketRepository.update(new BucketModel(bucket));
                                arrayShift(buckets, i, length);
                                length--;
                                continue outer;
                            }

                            i++;
                        } while(i < length);

                        bucketRepository.delete(dboId);
                    }

                    for(int i = 0; i < length; i ++) {
                        bucketRepository.insert(new BucketModel(buckets[i]));
                    }

                    db.setTransactionSuccessful();
                } catch (Exception e) {

                } finally {
                    db.endTransaction();
                    db.close();
                }

                if(mContext != null) {
                    mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_BUCKETS_UPDATED, true);
                }
            }

            @Override
            public void onError(int code, String message) {
                _buckets = null;

                if(mContext != null) {
                    mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_BUCKETS_UPDATED, false);
                }
            }
        });
    }

    private void getFiles(String bucketId) {
        StorjAndroid.getInstance(this).listFiles(bucketId, new ListFilesCallback() {
            @Override
            public void onFilesReceived(File[] files) {
                _files = files;

                if(files == null) {
                    return;
                }

                SQLiteDatabase db = new DatabaseFactory(GetBucketsService.this, null).getWritableDatabase();
                FileRepository fileRepository = new FileRepository(db);
                db.beginTransaction();

                try {
                    List<FileDbo> fileDbos = fileRepository.getAll();

                    int length = files.length;
                    boolean[] isUpdate = new boolean[files.length];

                    outer:
                    for(FileDbo fileDbo : fileDbos) {
                        int i = 0;
                        String dboId = fileDbo.getId();

                        do {
                            File file = files[i];
                            String id = file.getId();

                            if(dboId == id) {
                                fileRepository.update(new FileModel(file));
                                arrayShift(files, i, length);
                                length--;
                                continue outer;
                            }

                            i++;
                        } while(i < length);

                        fileRepository.delete(dboId);
                    }

                    for(int i = 0; i < length; i ++) {
                        Response resp =  fileRepository.insert(new FileModel(files[i]));
                    }

                    db.setTransactionSuccessful();
                } catch (Exception e) {
                    String s = e.getMessage();
                } finally {
                    db.endTransaction();
                    db.close();
                }

                if(mContext != null) {
                    mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_FILES_UPDATED, true);
                }
            }

            @Override
            public void onError(int code, String message) {
                _files = null;

                if(mContext != null) {
                    mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_FILES_UPDATED, false);
                }
            }
        });
    }

    private <T> void arrayShift(T[] array, int pos, int length) {
        do {
            array[pos] = array[pos + 1];
            pos++;
        }
        while(pos < length - 1);
    }

    public class GetBucketsServiceBinder extends Binder {
        public GetBucketsService getService() { return GetBucketsService.this; }
    }

    public void setReactContext(ReactContext context) {
        mContext = context;
    }
}
