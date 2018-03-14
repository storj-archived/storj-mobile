package storjlib;

import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;

import storjlib.Models.BucketModel;
import storjlib.Models.FileModel;
import storjlib.Models.UploadingFileModel;
import storjlib.Responses.SingleResponse;
import storjlib.dataProvider.DatabaseFactory;
import storjlib.dataProvider.Dbo.BucketDbo;
import storjlib.dataProvider.Dbo.FileDbo;
import storjlib.dataProvider.Dbo.UploadingFileDbo;
import storjlib.dataProvider.repositories.BucketRepository;
import storjlib.dataProvider.repositories.FileRepository;
import storjlib.dataProvider.repositories.UploadingFilesRepository;

/**
 * Created by Yaroslav-Note on 3/9/2018.
 */

public class SyncModule extends ReactContextBaseJavaModule {
    public SyncModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SyncModule";
    }

    @ReactMethod
    public void listBuckets(final Promise promise) {
        Log.d("SYNC DEBUG", "List buckets sort START");
        new Thread(new Runnable() {
            @Override
            public void run() {
                try(SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase()) {
                    //SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase();
                    BucketRepository bucketRepository = new BucketRepository(db);

                    ArrayList<BucketDbo> bucketDbos = (ArrayList)bucketRepository.getAll();

                    int length = bucketDbos.size();
                    BucketModel[] bucketModels = new BucketModel[length];

                    for(int i = 0; i < length; i++) {
                        bucketModels[i] = bucketDbos.get(i).toModel();
                    }

                    promise.resolve(new SingleResponse(true, toJson(bucketModels), null).toWritableMap());
                } catch (Exception e) {
                    promise.resolve(new SingleResponse(false, null, e.getMessage()).toWritableMap());
                }
                Log.d("SYNC DEBUG", "List buckets sort END");
            }
        }).run();
    }

    @ReactMethod
    public void listFiles(final String bucketId, final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try(SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase()) {
                    //SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase();

                    FileRepository fileRepository = new FileRepository(db);

                    ArrayList<FileDbo> fileDbos = (ArrayList)fileRepository.getAll(bucketId);

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
    public void listUploadingFiles(String bucketId, final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try(SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase()) {
                    //SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase();

                    UploadingFilesRepository fileRepository = new UploadingFilesRepository(db);

                    ArrayList<UploadingFileDbo> fileDbos = (ArrayList)fileRepository.getAll();

                    int length = fileDbos.size();
                    UploadingFileModel[] fileModels = new UploadingFileModel[length];

                    for(int i = 0; i < length; i++) {
                        fileModels[i] = new UploadingFileModel(fileDbos.get(i));
                    }

                    promise.resolve(new SingleResponse(true, toJson(fileModels), null).toWritableMap());
                } catch (Exception e) {
                    promise.resolve(new SingleResponse(false, null, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    @ReactMethod
    public void getUploadingFile(final String fileHandle, final Promise promise) {
        if (fileHandle == null) {
            promise.resolve(new SingleResponse(false, null, "Invalid fileHandle!").toWritableMap());
        }

        new Thread(new Runnable() {
            @Override
            public void run() {
                try(SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase()) {
                    UploadingFilesRepository repo = new UploadingFilesRepository(db);
                    UploadingFileModel model = repo.get(fileHandle);

                    if(model == null) {
                        promise.resolve(new SingleResponse(false, null, "Uploading file not found!").toWritableMap());
                    } else {
                        promise.resolve(new SingleResponse(true, toJson(model), null).toWritableMap());
                    }

                } catch (Exception e) {
                    promise.resolve(new SingleResponse(false, null, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    @ReactMethod
    public void getFile(final String fileId, final Promise promise) {
        if (fileId == null) {
            promise.resolve(new SingleResponse(false, null, "Invalid fileId!").toWritableMap());
        }

        new Thread(new Runnable() {
            @Override
            public void run() {
                try(SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase()) {
                    FileRepository repo = new FileRepository(db);
                    FileDbo model = repo.get(fileId);

                    if(model == null) {
                        promise.resolve(new SingleResponse(false, null, "File not found!").toWritableMap());
                    } else {
                        promise.resolve(new SingleResponse(true, toJson(model.toModel()), null).toWritableMap());
                    }

                } catch (Exception e) {
                    promise.resolve(new SingleResponse(false, null, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    private <T> String toJson(T[] convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }

    private <T> String toJson(T convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }
}
