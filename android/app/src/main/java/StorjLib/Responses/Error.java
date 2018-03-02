package StorjLib.Responses;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import StorjLib.Interfaces.IConvertibleToJs;

/**
 * Created by Crawter on 01.03.2018.
 */

public class Error implements IConvertibleToJs {
    private final String KEY_ERROR_MESSAGE = "errorMessage";
    private final String KEY_ERROR_CODE = "errorCode";

    private String _message;
    private int _code;

    public Error(String message, int code) {
        _message = message;
        _code = code;
    }

    public String getMessage() {
        return _message;
    }

    public int getCode() {
        return _code;
    }

    @Override
    public WritableMap toWritableMap() {
        WritableMap error = Arguments.createMap();

        error.putString(KEY_ERROR_MESSAGE, _message);
        error.putInt(KEY_ERROR_CODE, _code);

        return error;
    }
}
