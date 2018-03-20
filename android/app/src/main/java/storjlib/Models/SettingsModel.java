package storjlib.Models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import storjlib.dataProvider.contracts.SettingsContract;

/**
 * Created by Yaroslav-Note on 3/19/2018.
 */

public class SettingsModel {
    @Expose
    @SerializedName(SettingsContract._SETTINGS_ID)
    private String _id;
    @Expose
    @SerializedName(SettingsContract._LAST_SYNC)
    private String _lastSync;

    public SettingsModel() {

    }

    public SettingsModel(String settingsId) {
        this(settingsId,null);
    }

    public SettingsModel(String settingsId, String lastSync) {
        _id = settingsId;
        _lastSync = lastSync;
    }

    public String getId() { return _id; }
    public String lastSync() { return _lastSync; }
}
