package StorjLib.Responses;

/**
 * Created by Crawter on 19.02.2018.
 */

public class Response {
    public final String KEY_IS_SUCCESS = "isSuccess";
    public final String KEY_ERROR_MESSAGE = "errorMessage";
    public final String KEY_RESULT = "result";

    private boolean _isSuccess = false;
    private String _errorMessage = null;

    public Response(boolean isSuccess, String errorMessage) {
        _isSuccess = isSuccess;
        _errorMessage = errorMessage;
    }

    public boolean isSuccess() {
        return _isSuccess;
    }
    public String errorMessage() {
        return _errorMessage;
    }
}
