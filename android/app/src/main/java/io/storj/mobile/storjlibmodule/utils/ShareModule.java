package io.storj.mobile.storjlibmodule.utils;

import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ShareModule extends ReactContextBaseJavaModule {

    public ShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ShareModule2";
    }

    @ReactMethod
    public void share(String uri) {
        Uri _uri = Uri.parse(uri);

        Intent shareIntent = new Intent();
        shareIntent.setAction(Intent.ACTION_SEND);
        shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        shareIntent.putExtra(Intent.EXTRA_STREAM, _uri);
        shareIntent.setType("image/*");
        getReactApplicationContext().startActivity(Intent.createChooser(shareIntent, "Share images to..."));
    }
}
