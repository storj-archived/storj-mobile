package StorjLib.CallbackWrappers;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import StorjLib.GsonSingle;
import StorjLib.Models.FileModel;
import StorjLib.Models.UploadFileProgressModel;
import StorjLib.Responses.Response;
import StorjLib.Responses.SingleResponse;
import StorjLib.StorjLibModule;
import io.storj.libstorj.File;
import io.storj.libstorj.UploadFileCallback;

/**
 * Created by Crawter on 26.02.2018.
 */

public class UploadFileCallbackWrapper implements UploadFileCallback {

    private Promise _promise;
    private String _bucketId;
    private ReactApplicationContext _context;
    private long _fileRef;
    private boolean _uploadStart = false;
    private double _lastPercent = 0;

    public UploadFileCallbackWrapper(ReactApplicationContext context, Promise promise, String bucketId) {
        _promise = promise;
        _bucketId = bucketId;
        _context = context;
    }

    @Override
    public void onProgress(String filePath, double progress, long uploadedBytes, long totalBytes) {
        if(!_uploadStart) {
            _uploadStart = true;
            _fileRef = StorjLibModule._uploadFileRef;
        }

        double current = Math.round(progress * 10);

        if(_lastPercent != current) {
            _lastPercent = current;
            UploadFileProgressModel uploadModel = new UploadFileProgressModel(_bucketId, filePath, progress, uploadedBytes, totalBytes, _fileRef);
            _context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("uploadFile", uploadModel.toWritableMap());
        }
    }

    @Override
    public void onComplete(String filePath, File file) {
        FileModel model = new FileModel(file);

        _promise.resolve(new SingleResponse(true, toJson(model), "File is not valid").toWritableMap());
    }

    @Override
    public void onError(String filePath, int code, String message) {
        _promise.resolve(new Response(false, message).toWritableMap());
    }

    private String toJson(FileModel convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }
}
