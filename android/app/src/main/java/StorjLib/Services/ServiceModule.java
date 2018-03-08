package storjlib.services;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.database.sqlite.SQLiteDatabase;
import android.os.IBinder;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.List;

import storjlib.GsonSingle;
import storjlib.Models.BucketModel;
import storjlib.Models.FileModel;
import storjlib.Responses.Response;
import storjlib.Responses.SingleResponse;
import storjlib.dataProvider.DatabaseFactory;
import storjlib.dataProvider.Dbo.BucketDbo;
import storjlib.dataProvider.Dbo.FileDbo;
import storjlib.dataProvider.repositories.BucketRepository;
import storjlib.dataProvider.repositories.FileRepository;

/**
 * Created by Yaroslav-Note on 3/6/2018.
 */

public class ServiceModule extends ReactContextBaseJavaModule {

    public final static String GET_BUCKETS = "GET_BUCKETS";
    public final static String GET_FILES = "GET_FILES";
    public final static String BUCKET_CREATED = "BUCKET_CREATED";
    public final static String BUCKET_DELETED = "BUCKET_DELETED";
    public final static String FILE_DELETED = "FILE_DELETED";

    private final SQLiteDatabase _db;
    private final BucketRepository _bRepository;
    private final FileRepository _fRepository;

    private GetBucketsService mGetBucketsService;
    private Promise mPromise;

    private final ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            GetBucketsService.GetBucketsServiceBinder binder = (GetBucketsService.GetBucketsServiceBinder)service;
            mGetBucketsService = binder.getService();
            mGetBucketsService.setReactContext(getReactApplicationContext());

            if(mPromise != null) {
                mPromise.resolve(true);
                mPromise = null;
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            mGetBucketsService = null;
        }
    };

    public ServiceModule(ReactApplicationContext reactContext)
    {
        super(reactContext);
        _db = new DatabaseFactory(getReactApplicationContext(), null).getWritableDatabase();
        _fRepository = new FileRepository(_db);
        _bRepository = new BucketRepository(_db);
    }

    @Override
    public String getName() {
        return "ServiceModule";
    }

    @ReactMethod
    public void bindService(Promise promise) {
        mPromise = promise;
        Intent testIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
        getReactApplicationContext().bindService(testIntent, mConnection, Context.BIND_AUTO_CREATE);
    }

    @ReactMethod
    public void getBuckets() {
        Intent serviceIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
        serviceIntent.setAction(GET_BUCKETS);

        getReactApplicationContext().startService(serviceIntent);
    }

    @ReactMethod
    public void listBuckets(final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase();

                    BucketRepository bucketRepository = new BucketRepository(db);

                    List<BucketDbo> bucketDbos = bucketRepository.getAll();

                    int length = bucketDbos.size();
                    BucketModel[] bucketModels = new BucketModel[length];

                    for(int i = 0; i < length; i++) {
                        bucketModels[i] = bucketDbos.get(i).toModel();
                    }

                    promise.resolve(new SingleResponse(true, toJson(bucketModels), null).toWritableMap());
                } catch (Exception e) {
                    promise.resolve(new SingleResponse(false, null, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    @ReactMethod
    public void getFiles(String bucketId) {
        Intent serviceIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
        serviceIntent.setAction(GET_FILES);
        serviceIntent.putExtra("bucketId", bucketId);

        getReactApplicationContext().startService(serviceIntent);
    }

    @ReactMethod
    public void listFiles(final String bucketId, final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase();

                    FileRepository fileRepository = new FileRepository(db);

                    ArrayList<FileDbo> fileDbos = (ArrayList)fileRepository.get(bucketId);

                    int length = fileDbos.size();
                    FileModel[] fileModels = new FileModel[length];

                    for(int i = 0; i < length; i++) {
                        fileModels[i] = fileDbos.get(i).toModel();
                    }

                    promise.resolve(new SingleResponse(true, toJson(fileModels), null).toWritableMap());
                } catch (Exception e) {
                    promise.resolve(new SingleResponse(false, null, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    @ReactMethod
    public void createBucket(final String bucketName) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Intent serviceIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
                    serviceIntent.setAction(BUCKET_CREATED);
                    serviceIntent.putExtra("bucketName", bucketName);

                    getReactApplicationContext().startService(serviceIntent);
                } catch (Exception e) {
                }
            }
        }).run();
    }

    @ReactMethod
    public void deleteBucket(final String bucketId) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Intent serviceIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
                    serviceIntent.setAction(BUCKET_DELETED);
                    serviceIntent.putExtra("bucketId", bucketId);

                    getReactApplicationContext().startService(serviceIntent);
                } catch (Exception e) {
                }
            }
        }).run();
    }

    @ReactMethod
    public void deleteFile(final String bucketId, final String fileId) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Intent serviceIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
                    serviceIntent.setAction(FILE_DELETED);
                    serviceIntent.putExtra("bucketId", bucketId);
                    serviceIntent.putExtra("fileId", fileId);


                    getReactApplicationContext().startService(serviceIntent);
                } catch (Exception e) {
                }
            }
        }).run();
    }

    @ReactMethod
    public void updateBucketStarred(final String bucketId, final boolean isStarred, final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Response updateResponse = _bRepository.update(bucketId, isStarred);

                    promise.resolve(new Response(true, null).toWritableMap());
                } catch (Exception e) {
                    promise.resolve(new Response(false, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    @ReactMethod
    public void updateFileStarred(final String fileId, final boolean isStarred, final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Response updateResponse = _fRepository.update(fileId, isStarred);

                    promise.resolve(_fRepository.update(fileId, isStarred).toWritableMap());
                } catch (Exception e) {
                    promise.resolve(new Response(false, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    @ReactMethod
    public void getStarredFiles(final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    SingleResponse response = new SingleResponse(true, toJson(_fRepository.getStarred()), null);
                    promise.resolve(response.toWritableMap());
                } catch (Exception e) {
                    promise.resolve(new Response(false, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    @ReactMethod
    public void getStarredBuckets(final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    SingleResponse response = new SingleResponse(true, toJson(_bRepository.getStarred()), null);
                    promise.resolve(response.toWritableMap());
                } catch (Exception e) {
                    promise.resolve(new Response(false, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    private <T> String toJson(T[] convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }

    private <T> String toJson(List<T> convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }
}
