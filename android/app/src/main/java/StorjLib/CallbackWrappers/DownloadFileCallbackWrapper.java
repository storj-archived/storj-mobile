package StorjLib.CallbackWrappers;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import StorjLib.GsonSingle;
import StorjLib.Models.DownloadFileModel;
import StorjLib.Models.DownloadFileProgressModel;
import StorjLib.Models.FileModel;
import StorjLib.Models.UploadFileProgressModel;
import StorjLib.Responses.Response;
import StorjLib.Responses.SingleResponse;
import StorjLib.StorjLibModule;
import io.storj.libstorj.DownloadFileCallback;

/**
 * Created by Crawter on 27.02.2018.
 */

public class DownloadFileCallbackWrapper implements DownloadFileCallback {

    private Promise _promise;
    private String _bucketId;
    private String _fileId;
    private String _localPath;
    private ReactApplicationContext _context;
    private long _fileRef;
    private boolean _uploadStart = false;
    private double _lastPercent = 0;

    public DownloadFileCallbackWrapper(ReactApplicationContext context, Promise promise, String bucketId, String fileId, String localPath) {
        _promise = promise;
        _bucketId = bucketId;
        _localPath = localPath;
        _context = context;
        _fileId = fileId;
    }

    @Override
    public void onProgress(String fileId, double progress, long downloadedBytes, long totalBytes) {
        if(!_uploadStart) {
            _uploadStart = true;
            _fileRef = StorjLibModule._downloadFileRef;
        }

        double current = Math.round(progress * 10);

        if(_lastPercent != current) {
            _lastPercent = current;
            DownloadFileProgressModel uploadModel = new DownloadFileProgressModel(_bucketId, fileId,_localPath, progress, downloadedBytes, totalBytes, _fileRef);
            _context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("downloadFile", uploadModel.toWritableMap());
        }
    }

    @Override
    public void onComplete(String fileId, String localPath) {
        DownloadFileModel model = new DownloadFileModel(fileId, localPath);

        _promise.resolve(new SingleResponse(true, toJson(model), null).toWritableMap());
    }

    @Override
    public void onError(String fileId, int code, String message) {
        _promise.resolve(new Response(false, message).toWritableMap());
    }

    private String toJson(DownloadFileModel convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }
}
