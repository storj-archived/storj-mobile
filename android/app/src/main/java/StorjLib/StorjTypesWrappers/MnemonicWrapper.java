package storjlib.StorjTypesWrappers;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import storjlib.Interfaces.IConvertibleToJs;

/**
 * Created by Yaroslav-Note on 1/24/2018.
 */

public class MnemonicWrapper implements IConvertibleToJs {

    private String _mnemonic;

    public MnemonicWrapper(String mnemonic) {
        _mnemonic = mnemonic;
    }

    public WritableMap toWritableMap() {
        WritableMap stringJs = Arguments.createMap();

        stringJs.putString("mnemonic", _mnemonic);

        return stringJs;
    }
}
