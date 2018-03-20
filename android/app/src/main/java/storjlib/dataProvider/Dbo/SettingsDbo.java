package storjlib.dataProvider.Dbo;

import storjlib.dataProvider.contracts.SettingsContract;

/**
 * Created by Yaroslav-Note on 3/19/2018.
 */

public class SettingsDbo {
    private String _id;
    private String _lastSync;

    public SettingsDbo() {}

    public SettingsDbo(String settingsId, String lastSync) {
        _id = settingsId;
        _lastSync = lastSync;
    }

    public void setProp(String paramName, String paramValue) {
        switch (paramName) {
            case SettingsContract._SETTINGS_ID:
                _id = paramValue;
                break;
            case SettingsContract._LAST_SYNC:
                _lastSync = paramValue;
                break;
        }
    }
}
