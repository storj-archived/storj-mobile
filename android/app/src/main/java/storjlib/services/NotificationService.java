package storjlib.services;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.BitmapFactory;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import io.storj.R;

public class NotificationService {

    private Context mContext;
    private NotificationCompat.Builder mNotificationBuilder;
    private NotificationManager mNotificationManager;

    public NotificationService() {
    }

    public void init(Context context) {
        mContext = context;
        initBuilder(context);
        initManager(context);
    }

    private void initBuilder(Context context) {
        mNotificationBuilder = new NotificationCompat.Builder(context)
                .setContentTitle("Uploading file")
                .setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.mipmap.logo_blue))
                .setSmallIcon(R.mipmap.logo_white)
                .setAutoCancel(false)
                .setPriority(Notification.PRIORITY_LOW)
                .setOnlyAlertOnce(true);
    }

    private void initManager(Context context) {
        mNotificationManager = (NotificationManager) context.getSystemService(context.NOTIFICATION_SERVICE);
    }

    public void notify(int id, String message, int progress, int maxProgress/*, NotificationCompat.Action action*/) {
        mNotificationBuilder
                .setProgress(maxProgress, progress, false)
                .setContentText(message);

        /*if(action != null) {
            mNotificationBuilder.addAction(action);
        }*/

        /*if(maxProgress != 0) {
            mNotificationBuilder.setOngoing(true);
        }*/

        try {
            mNotificationManager.notify(id, mNotificationBuilder.build());
        } catch(Exception e) {
            Log.d("NOTIFICATION DEBUG", e.getMessage());
        }
    }

    public void notifyPriorityHigh(int id, String message) {

        final NotificationManager manager = (NotificationManager) mContext.getSystemService(mContext.NOTIFICATION_SERVICE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext)
                .setContentText(message)
                .setContentTitle("Uploading file")
                .setDefaults(Notification.DEFAULT_VIBRATE)
                .setLargeIcon(BitmapFactory.decodeResource(mContext.getResources(), R.mipmap.logo_blue))
                .setSmallIcon(R.mipmap.logo_white)
                .setAutoCancel(false)
                .setPriority(Notification.PRIORITY_HIGH);

        try {
            manager.notify(id, builder.build());
        } catch(Exception e) {
            Log.d("NOTIFICATION DEBUG", e.getMessage());
        }
    }
}
