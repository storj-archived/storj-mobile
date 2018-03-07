package storjlib.CallbackWrappers;

import com.facebook.react.bridge.Promise;

import storjlib.Responses.Response;
import storjlib.Responses.SingleResponse;
import io.storj.libstorj.RegisterCallback;

/**
 * Created by Crawter on 22.02.2018.
 */

public class RegisterCallbackWrapper extends BaseCallbackWrapper implements RegisterCallback {

    private String _mnemonic;

    public RegisterCallbackWrapper(Promise promise, String mnemonic) {
        super(promise);
        _mnemonic = mnemonic;
    }

    @Override
    public void onConfirmationPending(final String email) {
        _promise.resolve(new SingleResponse(true, _mnemonic, null).toWritableMap());
    }

    @Override
    public void onError(int code, String message) {
        _promise.resolve(new Response(false, message, code).toWritableMap());
    }
}
