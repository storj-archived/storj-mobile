package io.storj.mobile.storjlibmodule.enums;

public enum SyncStateEnum {
    QUEUED(0),
    PROCESSING(1),
    ERROR(2),
    CANCELED(3),
    PROCESSED(4);

    private int mValue;

    SyncStateEnum(int value) {
        mValue = value;
    }

    public int getValue() { return mValue; }
}
