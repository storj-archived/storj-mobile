package storjlib;

import android.os.Process;

import storjlib.responses.Response;
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
                if(Process.getThreadPriority(0) != Process.THREAD_PRIORITY_BACKGROUND) {
                    Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
                }

                invoke(param, callback);
            }
        }).start();
    }
}
