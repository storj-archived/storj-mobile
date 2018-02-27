package StorjLib.Responses;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by Crawter on 22.02.2018.
 */

public class ListResponse extends Response {
    private String[] _result = null;

    public ListResponse(boolean isSuccess, String errorMessage, String[] result) {
        super(isSuccess, errorMessage);
        _result = result;
    }

    @Override
    public WritableMap toWritableMap() {
        WritableMap map = super.toWritableMap();

        map.putArray(KEY_RESULT, Arguments.fromArray(_result));

        return map;
    }

    public String[] getResult() {
        return _result;
    }
}
