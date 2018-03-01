package StorjLib.Responses;

/**
 * Created by Crawter on 01.03.2018.
 */

public class Error {
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
}
