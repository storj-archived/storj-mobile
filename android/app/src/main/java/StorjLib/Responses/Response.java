package StorjLib.Responses;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import StorjLib.Interfaces.IConvertibleToJs;

/**
 * Created by Crawter on 19.02.2018.
 */

public class Response implements IConvertibleToJs {
    private final String KEY_IS_SUCCESS = "isSuccess";
    private final String KEY_ERROR_MESSAGE = "errorMessage";
    protected final String KEY_RESULT = "result";

    private boolean _isSuccess = false;
    private String _errorMessage = null;

    public Response(boolean isSuccess, String errorMessage) {
        _isSuccess = isSuccess;
        _errorMessage = errorMessage;
    }

    @Override
    public WritableMap toJsObject() {

        WritableMap map = Arguments.createMap();

        map.putBoolean(KEY_IS_SUCCESS, _isSuccess);
        map.putString(KEY_ERROR_MESSAGE, _errorMessage);

        return map;
    }

    public boolean isSuccess() {
        return _isSuccess;
    }
    public String errorMessage() {
        return _errorMessage;
    }
}
