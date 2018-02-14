/* bucketId
:
"8ced014b9658b579f0051479"
created
:
"2018-02-09T15:49:26.417Z"
erasure
:
null
fileId
:
"fb317ee1ad6c4a768669d46d"
hmac
:
"95d8f185ad747b2cff0f7bc184fd8bcb38b763c192c074136ce5229b71094a26348579a886cb3798ae5b6b75518b8ce5e356fe3b29c6437639c796df39570f66"
index
:
null
mimeType
:
"image/jpeg"
name
:
"images.jpg"
size
:
7737 */

import ItemModel from './ItemModel';

export default class FileModel extends ItemModel {
    /**
    * Describes file entity
    * @param {object} file
    */
    constructor(file) {
            super(file.name, file.fileId, file.created);
            
            this.erasure = file.erasure;
            this.hmac = file.hmac;
            this.index = file.index;
            this.mimeType = file.mimeType;
            this.size = file.size;
            this.bucketId = file.bucketId;
    }
}