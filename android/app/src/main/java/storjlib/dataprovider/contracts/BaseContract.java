package storjlib.dataprovider.contracts;

import android.provider.BaseColumns;

/**
 * Created by crawt on 3/3/2018.
 */

public abstract class BaseContract implements BaseColumns {
    public static final String _DEFAULT_WHERE_CLAUSE = _ID + " = ?";
}
