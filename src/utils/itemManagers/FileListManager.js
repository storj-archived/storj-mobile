import ListItemModel from '../../models/ListItemModel';
import FileListModel from '../../models/FileListModel';

export default class FileListManager {
    /**
     * 
     * @param {FileListModel[]} filesList 
     * @param {FileListModel[]} uploadingFileList 
     */
    constructor(filesList, uploadingFileList, downloadedFileList) {
        this.newFilesList = filesList.map(item => new FileListModel(item.bucketId, item.files));
        this.newFileUploadingList = uploadingFileList.map(item => new FileListModel(item.bucketId, item.files));
        this.newFileDownloadedList = downloadedFileList.map(item => new FileListModel(item.bucketId, item.files));
    }

    addFileEntry(bucketId, file) {
        return this._addFileEntry(this.newFilesList, bucketId, file);
    }

    addFileEntryU(bucketId, file) {
        return this._addFileEntry(this.newFileUploadingList, bucketId, file);
    }

    addFileEntryD(bucketId, file) {
        return this._addFileEntry(this.newFileDownloadedList, bucketId, file);
    }

    //--------------------------------------------------------------------------
    updateFileEntry(bucketId, file, id) {
        return this._updateFileEntry(this.newFilesList, bucketId, file, id);
    }

    updateFileEntryU(bucketId, file, id) {
        return this._updateFileEntry(this.newFileUploadingList, bucketId, file, id);
    }

    //------------------------------------------------------------------------
    deleteFileEntry(bucketId, fileId) {
        return this._deleteFileEntry(this.newFilesList, bucketId, fileId);
    }

    deleteFileEntryU(bucketId, fileId) {
        return this._deleteFileEntry(this.newFileUploadingList, bucketId, fileId);
    }

    testDelete(id) {
        this.newFileUploadingList = this.newFileUploadingList.map(listModel => {
            listModel.files = listModel.files.filter(file => file.getId() !== id);

            return listModel;
        });
        console.log(id);
        console.log(this.newFileUploadingList);
        return this.newFileUploadingList;
    }

    /**
     * @param {FileListModel[]} array
     * @param {string} bucketId 
     * @param {ListItemModel} file 
     */
    _addFileEntry(array, bucketId, file) {

        let doesContain = this._isInArray(array, bucketId, (itemsList) => {
            itemsList.files.push(file);
        });

        if(!doesContain) {
            array.push(new FileListModel(bucketId, [ file ]));
        }

        return array;
    }

    /**
     * @param {FileListModel[]} array
     * @param {string} bucketId 
     * @param {ListItemModel} file 
     * @param {string} id 
     */
    _updateFileEntry(array, bucketId, file, id) {
        let doesContain = this._isInArray(array, bucketId, (itemsList) => {

            itemsList.files.forEach(fileEntry => {
                if(fileEntry.getId() === id) {
                    fileEntry.entity = file.entity;
                    fileEntry.isLoading = false;
                }
            });
        });

        return array;
    }

    /**
     * 
     * @param {string} bucketId 
     * @param {string} fileId 
     */
    _deleteFileEntry(array, bucketId, fileId) {
        let doesContain = this._isInArray(array, bucketId, (itemsList) => {
            let newList = [];

            itemsList.files.forEach(fileEntry => {
                if(fileEntry.getId() !== fileId)
                    newList.push(fileEntry);
            });

            itemsList.files = newList;
        });

        return array;
    }

    /**
     * 
     * @param {string} bucketId 
     * @param {ListItemModel[]} files 
     */
    listFiles(bucketId, files) {
        let doesContain = this._isInArray(this.newFilesList, bucketId, (itemsList) => {
            let loadingFiles = [];

            itemsList.files = files.concat(loadingFiles);
        });

        if(!doesContain) {
            this.newFilesList.push(new FileListModel(bucketId, files));
        }

        return this.newFilesList;
    }

    listUploadingFiles(bucketId, files) {

        let doesContainUpload = this._isInArray(this.newFileUploadingList, bucketId, (itemList) => {
            files.forEach(newFile => {
                itemList.files = itemList.files.filter(file => newFile.getName() !== file.getName());
            });
        });

        return this.newFileUploadingList;
    }

    listUploadingFiles2(files) {
        files.forEach(file => {
            let filterResult = this.newFileUploadingList.find(listModel => listModel.bucketId === file.entity.bucketId);

            if(!filterResult) {
                this.newFileUploadingList.push(new FileListModel(file.entity.bucketId, [ file ]));
            } else {
                filterResult.files.push(file);
            }
        });

        return this.newFileUploadingList;
    }

    updateFileUploadingProgress(bucketId, fileId, progress, fileRef) {
        this._isInArray(this.newFileUploadingList, bucketId, (itemsList) => {
            itemsList.files.forEach(fileEntry => {
                if(fileEntry.getId() === fileId)
                    fileEntry.progress = progress;
                    fileEntry.fileRef = fileRef;
            });
        });

        return this.newFileUploadingList;
    }

    testUpdate(id, progress, uploaded) {
        this.newFileUploadingList = this.newFileUploadingList.map(listModel => {
            listModel.files.forEach(file => {
                if(file.getId() === id) {
                    file.progress = progress;//progress > file.progress ? progress : file.progress;
                    file.fileRef = id;
                }
            });

            return listModel;
        });
        return this.newFileUploadingList;
    }

    fileDownloaded(bucketId, fileId) {
        this._isInArray(this.newFilesList, bucketId, (itemsList) => {
            itemsList.files.forEach(fileEntry => {
                if(fileEntry.getId() === fileId) {
                    fileEntry.isLoading = false;
                    fileEntry.progress = 0;
                }                    
            });
        });

        return this.newFilesList;
    }

    updateFileDownloadingProgress(bucketId, fileId, progress, fileRef) {
        this._isInArray(this.newFilesList, bucketId, (itemsList) => {
            itemsList.files.forEach(fileEntry => {
                if(fileEntry.getId() === fileId) {
                    fileEntry.isLoading = true;
                    fileEntry.progress = progress;
                    fileEntry.fileRef = fileRef;
                }                    
            });
        });

        return this.newFilesList;
    }

    cancelDownload(bucketId, fileId) {
        this._isInArray(this.newFilesList, bucketId, (itemsList) => {
            itemsList.files = itemsList.files.map(fileEntry => {
                if(fileEntry.getId() !== fileId) {
                    fileEntry.isLoading = false;
                    fileEntry.progress = 0;
                }          

                return fileEntry;
            });
        });
       
        return this.newFilesList;
    }

    cancelUpload(bucketId, fileId) {
        this._isInArray(this.newFileUploadingList, bucketId, (itemsList) => {
            itemsList.files = itemsList.files.filter(fileEntry => {
                return fileEntry.getId() !== fileId          
            });
        });
       
        return this.newFilesList;
    }

    selectFile(file) {        
        return this._changeFileSelection(file.entity.bucketId, file.entity.id, true);
    }

    deselectFile(file) {
        return this._changeFileSelection(file.entity.bucketId, file.entity.id, false);
    }

    clearSelection() {
        this.newFilesList.forEach(fileList => {
            fileList.files.forEach((file) => {
                file.isSelected = false;
            })
        });

        return this.newFilesList;
    }

    _changeFileSelection(bucketId, fileId, value) {
        this._isInArray(this.newFilesList, bucketId, (fileList) => {
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
    _isInArray(array, bucketId, callback) {
        let doesContain = false;

        array.forEach(itemsList => {
            if(itemsList.bucketId === bucketId) {
                doesContain = true;
                callback(itemsList);
            }
        });

        return doesContain;
    }
}