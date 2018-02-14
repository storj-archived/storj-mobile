import ListItemModel from '../../models/ListItemModel';
import FileListModel from '../../models/FileListModel';


export default class FileListManager {
    /**
     * 
     * @param {FileListModel} filesList 
     */
    constructor(filesList) {
        this.newFilesList = filesList.map(item => new FileListModel(item.bucketId, item.files));
    }

    /**
     * Set isSelected prop of whole array to false
     * * @returns {ListItemModel[]}
     */
    clearSelection() {
        for(i = 0; i < this.newFilesList.length; i++) {
            this.itemList[i].files.forEach(file => {
                file.isSelected = false;
            });
        }

        return this.newFilesList;
    };

    /**
     * 
     * @param {string} bucketId 
     * @param {ListItemModel} file 
     */
    uploadFile(bucketId, file) {
        let doesContain = this._isInArray(bucketId, (itemsList) => {
            itemsList.files.push(file);
        });

        if(!doesContain) {
            this.newFilesList.push(new FileListModel(bucketId, [ file ]));
        }

        return this.newFilesList;
    }

    /**
     * 
     * @param {string} bucketId 
     * @param {string} fileId 
     */
    deleteFile(bucketId, fileId) {s
        let doesContain = this._isInArray(bucketId, (itemsList) => {
            let newList = [];

            itemsList.files.forEach(file => {
                if(file.getId() !== fileId)
                    newList.push(file);
            });

            itemsList.files = newList;
        });

        return this.newFilesList;
    }

    /**
     * 
     * @param {string} bucketId 
     * @param {ListItemModel[]} files 
     */
    listFiles(bucketId, files) {
        let doesContain = this._isInArray(bucketId, (itemsList) => {
            itemsList.files = files;
        });

        if(!doesContain) {
            this.newFilesList.push(new FileListModel(bucketId, files));
        }

        return this.newFilesList;
    }

    selectFile(file) {        
        return this._changeFileSelection(file.entity.bucketId, file.entity.id, true);
    }

    deselectFile(file) {
        return this._changeFileSelection(file.entity.bucketId, file.entity.id, false);
    }

    _changeFileSelection(bucketId, fileId, value) {
        this._isInArray(bucketId, (fileList) => {
            fileList.files.forEach(file => {
                if(file.getId() === fileId) 
                    file.isSelected = value;
            });
        });

        return this.newFilesList;
    }

    /**
     * 
     * @param {string} bucketId 
     * @param {function<FileListModel>} callback 
     */
    _isInArray(bucketId, callback) {
        let doesContain = false;

        this.newFilesList.forEach(itemsList => {
            if(itemsList.bucketId === bucketId) {
                doesContain = true;
                callback(itemsList);
            }
        });

        return doesContain;
    }
}