package StorjLib.dataProvider.contracts;

import android.provider.BaseColumns;

/**
 * Created by Crawter on 02.03.2018.
 */

public class BucketContract implements BaseColumns {
    public final static String TABLE_NAME = "buckets";

    public final static String _NAME = "name";
    public final static String _CREATED = "created";
    public final static String _DECRYPTED = "isDecrypted";
    public final static String _HASH = "hashCode";

    public static String createTalbe() {
        return String.format("create table if not exists %s (" +
                "%s TEXT primary key not null" +
                "%s TEXT not null" +
                "%s TEXT not null" +
                "%s INTEGER" +
                "%s TEXT not null",
                TABLE_NAME, _ID, _CREATED, _NAME, _DECRYPTED, _HASH);
    }
}
