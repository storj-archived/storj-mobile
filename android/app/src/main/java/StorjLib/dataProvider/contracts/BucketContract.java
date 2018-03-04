package StorjLib.dataProvider.contracts;

/**
 * Created by Crawter on 02.03.2018.
 */

public final class BucketContract extends BaseContract {
    public final static String TABLE_NAME = "buckets";

    public final static String _NAME = "name";
    public final static String _CREATED = "created";
    public final static String _DECRYPTED = "isDecrypted";
    public final static String _HASH = "hashCode";
    public final static String _STARRED = "isStarred";

    public static String createTalbe() {
        return String.format("create table if not exists %s (" +
                "%s TEXT primary key not null" +
                "%s TEXT not null" +
                "%s TEXT not null" +
                "%s INTEGER" +
                "%s INTEGER" +
                "%s TEXT not null",
                 TABLE_NAME, _ID, _CREATED, _NAME, _DECRYPTED, _STARRED, _HASH);
    }
}
