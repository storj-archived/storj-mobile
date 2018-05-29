package io.storj.mobile.storjlibmodule.services;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import java.util.List;

import io.storj.mobile.MainActivity;
import io.storj.mobile.R;
import io.storj.mobile.storjlibmodule.interfaces.NotificationResolver;

import static android.app.NotificationManager.*;

public class NotificationService {
    private Context mContext;
    private NotificationCompat.Builder mNotificationBuilder;
    private NotificationManager mNotificationManager;
    private NotificationResolver mNotificationResolver;

    public NotificationService() {
    }

    public void init(Context context, NotificationResolver notificationResolver) {
        mContext = context;
        initBuilder(context);
        initManager(context);
        mNotificationResolver = notificationResolver;
    }

    private void initBuilder(Context context) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);

        mNotificationBuilder = new NotificationCompat.Builder(context)
                .setContentTitle("Storj")
                .setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher))
                .setSmallIcon(R.mipmap.ic_launcher)
                .setAutoCancel(true)
                .setPriority(Notification.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setOnlyAlertOnce(true);
    }

    private void initManager(Context context) {
        mNotificationManager = (NotificationManager) context.getSystemService(context.NOTIFICATION_SERVICE);
    }

    public void notify(int id, String message, String title, int progress, int maxProgress) {
        if(mNotificationResolver != null && !mNotificationResolver.shouldShowNotification()) {
            return;
        }

        mNotificationBuilder
                .setContentTitle(title)
                .setProgress(maxProgress, progress, false)
                .setContentText(message);

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
                .setAutoCancel(true)
                .setPriority(Notification.PRIORITY_HIGH);

        try {
            manager.notify(id, builder.build());
        } catch(Exception e) {
            Log.d("NOTIFICATION DEBUG", e.getMessage());
        }
    }

    public NotificationCompat.Builder addAction(NotificationCompat.Action action) {
        return mNotificationBuilder.addAction(action);
    }

    public static void Clean(Context context) {
        if(context == null)
            return;

        getManager(context).cancelAll();
    }

    public static void Init(Context context) {
        if(context == null)
            return;

        createNotificationChannel(context, getManager(context));
    }

    private static NotificationManager getManager(Context context) {
        return (NotificationManager) context.getSystemService(context.NOTIFICATION_SERVICE);
    }

    private static void createNotificationChannel(Context context, NotificationManager notificationManager) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = context.getString(R.string.channel_name);
            String description = context.getString(R.string.channel_description);
            String id = context.getPackageName() + context.getString(R.string.channel_id);

            @SuppressLint("WrongConstant") NotificationChannel channel = new NotificationChannel(id, name, IMPORTANCE_DEFAULT);
            channel.setDescription(description);

            notificationManager.createNotificationChannel(channel);
        }
    }
}
