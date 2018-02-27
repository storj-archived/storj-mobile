package StorjLib.Models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import io.storj.libstorj.Keys;

/**
 * Created by Crawter on 22.02.2018.
 */

public class KeyModel implements IStorjModel {
    @Expose
    @SerializedName("email")
    private String _email;

    @Expose
    @SerializedName("password")
    private String _passord;

    @Expose
    @SerializedName("mnemonic")
    private String _mnemonic;

    public KeyModel(String email, String password, String mnemonic) {
        _email = email;
        _passord = password;
        _mnemonic = mnemonic;
    }

    public KeyModel(Keys key) {
        _email = key.getUser();
        _passord = key.getPass();
        _mnemonic = key.getMnemonic();
    }

    public boolean isValid() {
        return  _email != null && !_email.isEmpty() &&
                _passord != null && !_passord.isEmpty() &&
                _mnemonic != null && !_mnemonic.isEmpty();

    }

    public String getEmail() {
        return _email;
    }
    public String getPassword() {
        return _passord;
    }
    public String getMnemonic() {
        return _mnemonic;
    }
}
