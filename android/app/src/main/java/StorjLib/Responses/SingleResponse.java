package StorjLib.Responses;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import StorjLib.GsonSingle;
import StorjLib.Interfaces.IConvertibleToJs;

/**
 * Created by Yehor Butko on 1/24/2018.
 */
public class SingleResponse<T> extends Response {
    @Expose
    @SerializedName("result")
    private T _result;

    public SingleResponse(boolean isSuccess, T result, String errorMessage)  {
        super(isSuccess, errorMessage);
        _result = result;
    }

    @Override
    public WritableMap toJsObject() {
        WritableMap map = super.toJsObject();

        map.putString(KEY_RESULT, GsonSingle.getInstanse().toJson(_result));

        return map;
    }

    public T result() {
        return _result;
    }
}

