package io.storj.mobile.storjlibmodule.utils;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.util.Arrays;

import io.storj.mobile.storjlibmodule.responses.Response;

/**
 * React-native module. Contains functionality to open
 * local files with default availabe application in android
 */
public class OpenFileModule  extends ReactContextBaseJavaModule {
    public OpenFileModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "OpenFileModule";
    }

    /**
     * Tries to open file by selected uri
     *
     * @param fileUri path to the local file
     * @return Instance of {@link Response}
     */
    @ReactMethod
    public void openFile(String fileUri, Promise promise) {

        if (fileUri == null || fileUri.isEmpty()) {
            promise.resolve(new Response(false, "Uri is corrupted").toWritableMap());
            return;
        }

        Uri uri = Uri.fromFile(new File(fileUri));

        Intent intent = new Intent(Intent.ACTION_VIEW);
        String ext = getExtension(uri.toString());

        switch (ext) {
            case "doc":
                intent.setDataAndType(uri, "application/msword");
                break;
            case "pdf":
                intent.setDataAndType(uri, "application/pdf");
                break;
            case "ppt":
            case "pptx":
                intent.setDataAndType(uri, "application/vnd.ms-powerpoint");
                break;
            case "rtf":
                intent.setDataAndType(uri, "application/rtf");
                break;
            case "wav":
            case "mp3":
                intent.setDataAndType(uri, "audio/x-wav");
                break;
            case "txt":
                intent.setDataAndType(uri, "text/plain");
                break;
            case "3gp":
            case "mpg":
            case "mpeg":
            case "mpe":
            case "mp4":
            case "avi":
                intent.setDataAndType(uri, "video/*");
                break;
            default:
                intent.setDataAndType(uri, "*/*");
                promise.resolve(new Response(false, "File type not supported").toWritableMap());
                return;
        }

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        PackageManager packageManager = getReactApplicationContext().getPackageManager();

        if (intent.resolveActivity(packageManager) == null) {
            promise.resolve(new Response(false, "File type not suported or no default application for file found.").toWritableMap());
            return;
        }

        getReactApplicationContext().startActivity(intent);

        promise.resolve(new Response(true, null).toWritableMap());
    }

    @ReactMethod
    public void checkFile(String fileName, Promise promise) {
        String ext = getExtension(fileName);

        boolean contains = Arrays.asList(new String[] {"doc", "pdf",  "ppt", "pptx", "rtf", "wav", "mp3", "txt", "3gp", "mpg", "mpeg", "mpe", "mp4", "avi"}).contains(ext);

        promise.resolve(new Response(contains, null).toWritableMap());
    }

    private String getExtension(String uri) {
        String extension = "";

        int i = uri.lastIndexOf('.');
        if (i > 0) {
            extension = uri.substring(i+1);
        }

        return extension;
    }
}

