package StorjLib;

import io.storj.libstorj.KeysNotFoundException;

/**
 * Created by Crawter on 21.02.2018.
 */

public class MethodHandler  {
    public void invoke(final IMethodParams param, final ICallback callback) {
        try {
            if(callback == null) return;

            callback.callback(param);
        }
        catch (KeysNotFoundException error){
            param.getPromise().reject("");
        }
        catch(Exception error) {
            param.getPromise().reject("");
        }
    }

    public void invokeParallel(final IMethodParams param, final ICallback callback) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                invoke(param, callback);
            }
        }).start();
    }
}
