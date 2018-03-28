package storjlib.dataProvider.Dbo;

import storjlib.Models.SettingsModel;
import storjlib.dataProvider.contracts.SettingsContract;

/**
 * Created by Yaroslav-Note on 3/19/2018.
 */

public class SettingsDbo {
    private String _id;
    private boolean _isFirstSignIn;
    private boolean _syncStatus;
    private int _syncSettings;
    private String _lastSync;

    public SettingsDbo() {}

    public SettingsDbo(String settingsId, String lastSync) {
        _id = settingsId;
        _lastSync = lastSync;
    }

    public void setProp(String paramName, String paramValue) {
        switch (paramName) {
            case SettingsContract._ID:
                _id = paramValue;
                break;
            case SettingsContract._LAST_SYNC:
                _lastSync = paramValue;
                break;
        }
    }

    public void setProp(String paramName, int paramValue) {
        switch(paramName) {
            case SettingsContract._SYNC_SETTINGS:
                _syncSettings = paramValue;
                break;
        }
    }

    public void setProp(String paramName, boolean paramValue) {
        switch(paramName) {
            case SettingsContract._SYNC_STATUS:
                _syncStatus = paramValue;
                break;
            case SettingsContract._FIRST_SIGN_IN:
                _isFirstSignIn = paramValue;
                break;
        }
    }

    public SettingsModel toModel() {
        return new SettingsModel(_id, _isFirstSignIn, _syncStatus, _syncSettings, _lastSync);
    }
}
