package StorjLib.Responses;

import com.facebook.react.bridge.WritableMap;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Yehor Butko on 1/24/2018.
 */
public class SingleResponse extends Response {
    @Expose
    @SerializedName("result")
    private String _result;

    public SingleResponse(boolean isSuccess, String result, String errorMessage)  {
        super(isSuccess, errorMessage);
        _result = result;
    }

    @Override
    public WritableMap toWritableMap() {
        WritableMap map = super.toWritableMap();

        map.putString(KEY_RESULT, _result);

        return map;
    }

    public String result() {
        return _result;
    }
}

