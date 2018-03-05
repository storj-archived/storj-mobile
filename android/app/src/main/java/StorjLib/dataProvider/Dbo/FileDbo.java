package StorjLib.dataProvider.Dbo;

import StorjLib.dataProvider.contracts.FileContract;

/**
 * Created by Crawter on 05.03.2018.
 */

public class FileDbo {
    private String _bucketId;
    private String _created;
    private String _erasure;
    private String _hmac;
    private String _fileId;
    private String _index;
    private String _mimeType;
    private String _name;
    private long _size;
    private boolean _isDecrypted;
    private boolean _isStarred;

    public void setProp(String propName, String value) {
        switch(propName) {
            case FileContract._ID:
                _fileId = value;
                break;
            case FileContract._CREATED:
                _created = value;
                break;
            case FileContract._ERASURE:
                _erasure = value;
                break;
            case FileContract._HMAC:
                _hmac = value;
                 break;
            case FileContract._INDEX:
                _index = value;
                break;
            case FileContract._MIMETYPE:
                _mimeType = value;
                break;
            case FileContract.FILE_FK:
                _bucketId = value;
                break;
            case FileContract._NAME :
                _name = value;
                break;
        }
    }

    public void setProp(String propName, boolean value) {
        switch(propName) {
            case FileContract._DECRYPTED :
                _isDecrypted = value;
                break;
            case FileContract._STARRED :
                _isStarred = value;
                break;
        }
    }

    public void setProp(String propName, long value) {
        _size = value;
    }
}
