package StorjLib.Responses;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import StorjLib.Interfaces.IConvertibleToJs;

/**
 * Created by Yaroslav-Note on 1/24/2018.
 */

public class SingleResponse<T extends IConvertibleToJs> implements IConvertibleToJs {

    private boolean _isSuccess = false;
    private String _errorMessage = null;
    private T _result = null;

    public SingleResponse() {

    }

    public void error(String errorMessage) {
        _isSuccess = false;
        _errorMessage = errorMessage;
        _result = null;
    }

    public void success(T result) {
        _isSuccess = true;
        _errorMessage = null;
        _result = result;
    }

    public WritableMap toJsObject() {
        WritableMap responseJs = Arguments.createMap();

        responseJs.putBoolean("isSuccess", _isSuccess);
        responseJs.putString("errorMessage", _errorMessage);

        if(_result != null) {
            responseJs.putMap("result", _result.toJsObject());
        } else {
            responseJs.putMap("result", null);
        }

        return responseJs;
    }
}
