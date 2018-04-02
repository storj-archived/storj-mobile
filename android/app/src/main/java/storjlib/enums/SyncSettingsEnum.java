package storjlib.enums;

/**
 * Created by Yaroslav-Note on 3/20/2018.
 */

public enum SyncSettingsEnum {
    SYNC_ON        (0b10000000),
    ON_WIFI        (0b01000000),
    ON_CHARGING    (0b00100000),
    SYNC_PHOTOS    (0b00010000, "Pictures", "/storage/emulated/0/DCIM/Camera"),
    SYNC_MOVIES    (0b00001000, "Movies", "/storage/emulated/0/Movies"),
    SYNC_DOCUMENTS (0b00000100, "Documents", "/storage/emulated/0/Documents"),
    SYNC_MUSIC     (0b00000010, "Music", "/storage/emulated/0/Music");

    private int _value;
    private String _bucketName;
    private String _folderUri;

    SyncSettingsEnum(int value) {
        this(value, null, null);
    }
    SyncSettingsEnum(int value, String bucketName, String folderUri) {
        _value = value;
        _bucketName = bucketName;
        _folderUri = folderUri;
    }

    public int getValue() {
        return _value;
    }
    public String getBucketName() {
        return _bucketName;
    }
    public String geetFolderUri() { return _folderUri; }
}
