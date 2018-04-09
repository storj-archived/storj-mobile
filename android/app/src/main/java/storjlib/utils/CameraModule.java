package storjlib.utils;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.util.Date;

import storjlib.dataprovider.DatabaseFactory;
import storjlib.dataprovider.contracts.BucketContract;
import storjlib.dataprovider.contracts.FileContract;
import storjlib.dataprovider.contracts.SettingsContract;
import storjlib.dataprovider.dbo.BucketDbo;
import storjlib.dataprovider.repositories.BucketRepository;
import storjlib.enums.SyncSettingsEnum;
import storjlib.services.UploadService;

public class CameraModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    public final static String MODULE_NAME = "CameraModule";

    ReactContext mReactContext;

    public CameraModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mReactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void openCamera() {
        Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
        getReactApplicationContext().startActivityForResult(intent, 2132132, null);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if(requestCode == 2132132 && resultCode == Activity.RESULT_OK) {
            Bitmap image = (Bitmap) data.getExtras().get("data");
            String currentDateTimeString = DateFormat.getDateTimeInstance().format(new Date());
            long timeInMillis = System.currentTimeMillis() << 8 * 4;

            addFileToCameraRoll(image, currentDateTimeString + timeInMillis);
        }
    }

    private void addFileToCameraRoll(Bitmap bitmap, String name) {
        if(bitmap == null) {
            return;
        }

        File root = Environment.getExternalStorageDirectory();
        File file = new File(root.getAbsolutePath()+"/DCIM/Camera/" + name +".jpg");

        try {
            file.createNewFile();

            FileOutputStream stream = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream);
            stream.close();

            uploadFile(file);

        } catch (Exception e) {

        }
    }

    private void uploadFile(File file) {
        if(file == null) {
            return;
        }

        try(SQLiteDatabase db = new DatabaseFactory(mReactContext, null).getWritableDatabase()) {
            BucketRepository bucketRepo = new BucketRepository(db);
            BucketDbo bucketDbo = bucketRepo.get(BucketContract._NAME, SyncSettingsEnum.SYNC_PHOTOS.getBucketName());

            if(bucketDbo == null) {
                return;
            }

            startUpload(bucketDbo.getId(), file.getPath());
        } catch(Exception e) {}
    }

    private void startUpload(String bucketId, String uri) {
        Intent uploadIntent = new Intent(mReactContext, UploadService.class);
        uploadIntent.setAction(UploadService.ACTION_UPLOAD_FILE);
        uploadIntent.putExtra(UploadService.PARAMS_BUCKET_ID, bucketId);
        uploadIntent.putExtra(UploadService.PARAMS_URI, uri);
        uploadIntent.putExtra(FileContract._SYNCED, false);

        mReactContext.startService(uploadIntent);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
