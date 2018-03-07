package storjlib;

import storjlib.Responses.Response;
import io.storj.libstorj.KeysNotFoundException;

/**
 * Created by Crawter on 21.02.2018.
 */

public class MethodHandler  {
    public void invoke(final IMethodParams param, final IMethodHandlerCallback callback) {
        try {
            if(callback == null) return;

            callback.callback(param);
        }
        catch (KeysNotFoundException error) {
            param.getPromise().resolve(new Response(false, error.getMessage()).toWritableMap());
        }
        catch(Exception error) {
            param.getPromise().resolve(new Response(false, error.getMessage()).toWritableMap());
        }
    }

    public void invokeParallel(final IMethodParams param, final IMethodHandlerCallback callback) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                invoke(param, callback);
            }
        }).start();
    }
}
