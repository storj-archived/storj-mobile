package storjlib.Enum;

/**
 * Created by Yaroslav-Note on 3/20/2018.
 */

public enum SyncSettingsEnum {
    SYNC_ON        (0b10000000),
    ON_WIFI        (0b01000000),
    ON_CHARGING    (0b00100000),
    SYNC_PHOTOS    (0b00010000, "Pictures"),
    SYNC_MOVIES    (0b00001000, "Movies"),
    SYNC_DOCUMENTS (0b00000100, "Documents"),
    SYNC_DOWNLOADS (0b00000010, "Download");

    private int _value;
    private String _folderName;

    SyncSettingsEnum(int value) {
        this(value, null);
    }
    SyncSettingsEnum(int value, String folderName) {
        _value = value;
        _folderName = folderName;
    }

    public int getValue() {
        return _value;
    }
    public String getFolderName() {
        return _folderName;
    }
}
