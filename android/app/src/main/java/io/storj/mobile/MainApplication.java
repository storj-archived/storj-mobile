package io.storj.mobile;

import android.app.Activity;
import android.app.Application;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.reactnative.photoview.PhotoViewPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.storj.mobile.BuildConfig;

import java.util.Arrays;
import java.util.List;

import io.storj.mobile.storjlibmodule.interfaces.NotificationResolver;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.StorjLibPackage;
import io.storj.mobile.storjlibmodule.dataprovider.DatabaseFactory;
import io.storj.mobile.storjlibmodule.dataprovider.repositories.UploadingFilesRepository;
import io.storj.mobile.storjlibmodule.services.NotificationService;
import io.storj.mobile.storjlibmodule.services.SynchronizationService;

public class MainApplication extends Application implements ReactApplication, Application.ActivityLifecycleCallbacks, NotificationResolver {

    private boolean mIsForeground;

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
        SynchronizationService.clean(this);
        super.onCreate();
        NotificationService.Init(this);
        SoLoader.init(this, /* native exopackage */ false);
        registerActivityLifecycleCallbacks(this);
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

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {

    }

    @Override
    public void onActivityStarted(Activity activity) {

    }

    @Override
    public void onActivityResumed(Activity activity) {
        mIsForeground = true;
    }

    @Override
    public void onActivityPaused(Activity activity) {
        mIsForeground = false;
    }

    @Override
    public void onActivityStopped(Activity activity) {

    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

    }

    @Override
    public void onActivityDestroyed(Activity activity) {

    }

    @Override
    public boolean shouldShowNotification() {
        return !mIsForeground;
    }
}
