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