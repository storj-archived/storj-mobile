package io.storj.mobile.storjlibmodule.dataprovider.contracts;

import android.provider.BaseColumns;

/**
 * Created by Yaroslav-Note on 3/19/2018.
 */

public final class SettingsContract implements BaseColumns {

    private SettingsContract() {}

    public final static String TABLE_NAME = "settingsTable";

    public final static String _SETTINGS_ID = "settingsId";
    public final static String _FIRST_SIGN_IN = "isFirstSignIn";
    public final static String _SYNC_STATUS = "syncStatus";
    public final static String _SYNC_SETTINGS = "syncSettings";
    public final static String _LAST_SYNC = "lastSync";

    public static String createTable() {
        return String.format(
                "create table if not exists %s (" +
                        "%s TEXT primary key not null, " +
                        "%s NUMBER DEFAULT 1, " +
                        "%s NUMBER DEFAULT 0, " +
                        "%s NUMBER DEFAULT 0, " +
                        "%s TIMESTAMP)",
                TABLE_NAME, _ID, _FIRST_SIGN_IN, _SYNC_STATUS, _SYNC_SETTINGS, _LAST_SYNC);
    }
}
