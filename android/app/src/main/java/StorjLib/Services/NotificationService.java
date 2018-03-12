package storjlib.services;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.BitmapFactory;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.storjmobile.R;

public class NotificationService {

    private Context mContext;

    public NotificationService(Context context) {
        mContext = context;
    }

    public void notify(int id, String message, int progress, int maxProgress, NotificationCompat.Action action) {

        final NotificationManager manager = (NotificationManager) mContext.getSystemService(mContext.NOTIFICATION_SERVICE);

        //NotificationChannel chanel = new NotificationChannel("0", "TEST CHANEL", NotificationManager.IMPORTANCE_HIGH);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext)
                .setProgress(maxProgress, progress, false)
                .setContentText(message)
                .setContentTitle("Uploading file")
                .setDefaults(Notification.DEFAULT_VIBRATE)
                .setLargeIcon(BitmapFactory.decodeResource(mContext.getResources(), R.mipmap.logo_blue))
                .setSmallIcon(R.mipmap.logo_white)
                .setAutoCancel(false)
                .setPriority(Notification.PRIORITY_LOW);

        if(action != null) {
            builder.addAction(action);
        }

        try {
            manager.notify(id, builder.build());
        } catch(Exception e) {
            Log.d("NOTIFICATION DEBUG", e.getMessage());
        }
    }
}
