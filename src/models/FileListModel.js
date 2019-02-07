import ListItemModel from '../models/ListItemModel';

//TODO: add comments
export default class FileListModel {
    /**
     * @param {string} bucketId 
     * @param {ListItemModel[]} files 
     */
    constructor(bucketId = null, files = []) {
        this.bucketId = bucketId;
        this.files = files;

        this.entity = null;
        this.isLoading = false;
    }
}