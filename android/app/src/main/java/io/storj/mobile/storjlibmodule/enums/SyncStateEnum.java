package io.storj.mobile.storjlibmodule.enums;

import java.util.HashMap;
import java.util.Map;

public enum SyncStateEnum {
    IDLE(0),
    PROCESSING(1),
    ERROR(2),
    CANCELLED(3),
    PROCESSED(4),
    QUEUED(5);

    private int mValue;
    private static Map map = new HashMap<>();

    static {
        for (SyncStateEnum syncStateEnum : SyncStateEnum.values()) {
            map.put(syncStateEnum.getValue(), syncStateEnum);
        }
    }

    public static SyncStateEnum valueOf(int syncStateEnum) {
        return (SyncStateEnum) map.get(syncStateEnum);
    }

    SyncStateEnum(int value) {
        mValue = value;
    }

    public int getValue() { return mValue; }

}
