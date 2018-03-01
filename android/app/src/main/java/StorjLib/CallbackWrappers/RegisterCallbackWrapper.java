package StorjLib.CallbackWrappers;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

import StorjLib.Responses.Response;
import StorjLib.Responses.SingleResponse;
import StorjLib.StorjLibModule;
import io.storj.libstorj.RegisterCallback;
import io.storj.libstorj.android.StorjAndroid;

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
        _promise.resolve(new Response(false, "Mnemonic generation failed").toWritableMap());
    }
}
