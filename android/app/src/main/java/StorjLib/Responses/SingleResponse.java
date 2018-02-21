package StorjLib.Responses;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import StorjLib.Interfaces.IConvertibleToJs;

/**
 * Created by Yehor Butko on 1/24/2018.
 */
public class SingleResponse<T> extends Response {
    private T _result;

    public SingleResponse(boolean isSuccess, T result, String errorMessage)  {
        super(isSuccess, errorMessage);
        _result = result;
    }

    @Override
    public WritableMap toJsObject() {
        WritableMap map = super.toJsObject();

        map.putString(KEY_RESULT, );

        return map;
    }

    public T result() {
        return _result;
    }
}

