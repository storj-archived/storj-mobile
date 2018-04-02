package com.storjmobile;

import android.app.Application;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.reactnative.photoview.PhotoViewPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import storjlib.responses.Response;
import storjlib.StorjLibPackage;
import storjlib.dataprovider.DatabaseFactory;
import storjlib.dataprovider.repositories.UploadingFilesRepository;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
              return Arrays.<ReactPackage>asList(
                  new MainReactPackage(),
                    new PhotoViewPackage(),
                  new RCTCapturePackage(),
                  new StorjLibPackage()
              );
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }

    @Override
    public void onTerminate() {
        try(SQLiteDatabase db = new DatabaseFactory(this, null).getWritableDatabase()) {
            UploadingFilesRepository uploadRepo = new UploadingFilesRepository(db);
            Response deleteAllResponse = uploadRepo.deleteAll();
            Log.d("APPLICATION DEBUG", "onTerminate: isSuccess " + deleteAllResponse.isSuccess());
        } catch(Exception e) {
            Log.d("APPLICATION DEBUG", "onTerminate: error" + e.getMessage());
        }

        super.onTerminate();
    }
}
