package io.storj.mobile.storjlibmodule.models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import io.storj.mobile.storjlibmodule.dataprovider.contracts.SettingsContract;

/**
 * Created by Yaroslav-Note on 3/19/2018.
 */

public class SettingsModel {
    @Expose
    @SerializedName(SettingsContract._SETTINGS_ID)
    private String _id;
    @Expose
    @SerializedName(SettingsContract._FIRST_SIGN_IN)
    private boolean _isFirstSignIn;
    @Expose
    @SerializedName(SettingsContract._SYNC_STATUS)
    private boolean _syncStatus;
    @Expose
    @SerializedName(SettingsContract._SYNC_SETTINGS)
    private int _syncSettings;
    @Expose
    @SerializedName(SettingsContract._LAST_SYNC)
    private String _lastSync;

    public SettingsModel() {

    }

    public SettingsModel(String settingsId) {
        this(settingsId, false, false, 0,null);
    }

    public SettingsModel(String settingsId, boolean isFirstSignIn, boolean syncStatus, int syncSettings, String lastSync) {
        _id = settingsId;
        _syncStatus = syncStatus;
        _syncSettings = syncSettings;
        _lastSync = lastSync;
        _isFirstSignIn = isFirstSignIn;
    }

    public String getId() { return _id; }
    public boolean isFirstSignIn() { return _isFirstSignIn; }
    public boolean syncStatus() { return _syncStatus; }
    public int getSyncSettings() { return _syncSettings; }
    public String lastSync() { return _lastSync; }
}
