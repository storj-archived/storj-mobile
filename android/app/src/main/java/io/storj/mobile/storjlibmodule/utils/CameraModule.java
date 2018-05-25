package io.storj.mobile.storjlibmodule.utils;

import android.app.Activity;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.content.FileProvider;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.text.DateFormat;
import java.util.Date;

import io.storj.mobile.BuildConfig;
import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.contracts.FileContract;
import io.storj.mobile.storjlibmodule.dataprovider.dbo.BucketDbo;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.BucketRepository;
import io.storj.mobile.storjlibmodule.services.UploadService;

public class CameraModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    public final static String MODULE_NAME = "CameraModule";

    private ReactContext mReactContext;
    private String mCurrentPhotoPath;
    private String mCurrentBucketId;

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
    public void openCamera(String bucketId) {
        if(bucketId == null) {
            return;
        }

        String imageName = DateFormat.getDateTimeInstance().format(new Date()) + (System.currentTimeMillis() << 8 * 4);
        File storageDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);

        try {
            File image = File.createTempFile(imageName, ".jpg", storageDir);

            mCurrentPhotoPath = image.getAbsolutePath();
            mCurrentBucketId = bucketId;

            Uri photoURI = FileProvider.getUriForFile(mReactContext,
                    BuildConfig.APPLICATION_ID,
                    image);

            if(photoURI == null) {
                return;
            }

            Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            intent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);

            if(intent.resolveActivity(mReactContext.getPackageManager()) != null) {
                getReactApplicationContext().startActivityForResult(intent, 2132132, null);
                Log.d("CAMERA DEBUG", "Success!!");
            }
        } catch (Exception e) {
            Log.d("CAMERA DEBUG", e.getMessage());
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if(requestCode != 2132132) {
            return;
        }

        if(resultCode == Activity.RESULT_OK) {
            galleryAddPic(mCurrentPhotoPath);
            uploadFile(mCurrentPhotoPath, mCurrentBucketId);
        } 

        mCurrentPhotoPath = null;
        mCurrentBucketId = null;
    }

    private void galleryAddPic(String photoPath) {
        Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        File f = new File(photoPath);
        Uri contentUri = Uri.fromFile(f);
        mediaScanIntent.setData(contentUri);
        mReactContext.sendBroadcast(mediaScanIntent);
    }

    private void uploadFile(String filePath, String bucketId) {
        if(filePath == null || bucketId == null) {
            return;
        }

        try(SQLiteDatabase db = new DatabaseFactory(mReactContext, null).getWritableDatabase()) {
            BucketRepository bucketRepo = new BucketRepository(db);
            BucketDbo bucketDbo = bucketRepo.get(bucketId);

            if(bucketDbo == null) {
                return;
            }

            startUpload(bucketDbo.getId(), filePath);
        } catch(Exception e) {}
    }

    private void startUpload(String bucketId, String uri) {
        Intent uploadIntent = new Intent(mReactContext, UploadService.class);
        uploadIntent.setAction(UploadService.ACTION_UPLOAD_FILE);
        uploadIntent.putExtra(UploadService.PARAM_BUCKET_ID, bucketId);
        uploadIntent.putExtra(UploadService.PARAM_LOCAL_PATH, uri);

        mReactContext.startService(uploadIntent);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
