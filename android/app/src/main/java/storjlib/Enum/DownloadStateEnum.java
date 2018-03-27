package storjlib.Enum;

/**
 * Created by Yaroslav-Note on 3/26/2018.
 */

public enum DownloadStateEnum {
    DEFAULT(0),
    DOWNLOADING(1),
    DOWNLOADED(2);

    private int _value;

    DownloadStateEnum(int value) {
        _value = value;
    }

    public int getValue() {
        return _value;
    }
}
