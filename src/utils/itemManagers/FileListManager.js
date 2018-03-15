import ListItemModel from '../../models/ListItemModel';
import FileListModel from '../../models/FileListModel';

export default class FileListManager {
    /**
     * 
     * @param {FileListModel[]} filesList 
     * @param {FileListModel[]} uploadingFileList 
     */
    constructor(filesList, uploadingFileList, downloadedFileList) {
        this.newFilesList = filesList;
        this.newFileUploadingList = uploadingFileList;
        this.newFileDownloadedList = downloadedFileList;
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

    updateFileStarred(files) {        
        let fileIds = files.map(file => file.getId());
        
        this.newFilesList = this.newFilesList.map(file => {
            if(fileIds.includes(file.getId())) { 
                file.entity.isStarred = !file.entity.isStarred;
            }   

            return file;
        });

        return this.newFilesList;
    }

    //------------------------------------------------------------------------
    deleteFileEntry(bucketId, fileId) {
        return this._deleteFileEntry(this.newFilesList, bucketId, fileId);
    }

    deleteFileEntryU(bucketId, fileId) {
        return this._deleteFileEntry(this.newFileUploadingList, bucketId, fileId);
    }

    delete(id) {
        this.newFileUploadingList = this.newFileUploadingList.filter(file => file.getId() !== id);
        
        return this.newFileUploadingList;
    }

    /**
     * @param {FileListModel[]} array
     * @param {string} bucketId 
     * @param {ListItemModel} file 
     */
    _addFileEntry(array, bucketId, file) {
        let doesContain = false;

        array.forEach((item) => {
             if(item.getId() === file.getId()) doesContain = true;
        });

        if(!doesContain) {
            array.push(file);
        }

        array = array.map(file => file);
        
        return array;
    }

    /**
     * @param {FileListModel[]} array
     * @param {string} bucketId 
     * @param {ListItemModel} file 
     * @param {string} id 
     */
    _updateFileEntry(array, bucketId, file, id) {
        array = array.map((fileEntry) => {            
            if(fileEntry.getId() === id) {
                fileEntry.entity = file.entity;
                fileEntry.isLoading = false;    
            }

            return fileEntry;
        });

        return array;
    }

    /**
     * 
     * @param {string} bucketId 
     * @param {string} fileId 
     */
    _deleteFileEntry(array, bucketId, fileId) {
        array = array.filter(fileEntry => fileEntry.getId() !== fileId);
        
        return array;
    }

    /**
     * 
     * @param {string} bucketId 
     * @param {ListItemModel[]} files 
     */
    listFiles(bucketId, files) {
        let tempFilesArray = this.newFilesList.filter(file => file.entity.bucketId !== bucketId);
        
        this.newFilesList = tempFilesArray.concat(files);

        return this.newFilesList;
    }

    listUploadingFiles(bucketId, files) {
        let names = files.map(file => file.getName());
        let tempFilesArray = this.newFileUploadingList.filter(file => file.entity.bucketId === bucketId);        

        let newArray = tempFilesArray.filter(file => !names.includes(file.getName)).concat(this.newFileUploadingList.filter(file => file.entity.bucketId !== bucketId));

        return this.newFileUploadingList;
    }

    getUploadingFiles(files) {
        this.newFileUploadingList = files.slice();

        return this.newFileUploadingList;
    }

    updateFileUploadingProgress(bucketId, fileId, progress, fileRef) {
        this.newFileUploadingList.forEach(fileEntry => {
            if(fileEntry.getId() === fileId){
                fileEntry.progress = progress;
                fileEntry.fileRef = fileRef;
            }                
        });

        return this.newFileUploadingList;
    }

    update(id, progress, uploaded) {
        this.newFileUploadingList = this.newFileUploadingList.map(file => {
                if(file.getId() === id) {
                    file.progress = progress;
                    file.fileRef = id;
                }            

            return file;
        });

        return this.newFileUploadingList;
    }

    fileDownloaded(bucketId, fileId) {
        this.newFilesList = this.newFilesList.map(fileEntry => {
            if(fileEntry.getId() === fileId) {
                fileEntry.isLoading = false;
                fileEntry.progress = 0;
            }
            
            return fileEntry;
        });
    
        return this.newFilesList;
    }

    updateFileDownloadingProgress(bucketId, fileId, progress, fileRef) {
        this.newFilesList = this.newFilesList.map(fileEntry => {
            if(fileEntry.getId() === fileId) {
                fileEntry.isLoading = true;
                fileEntry.progress = progress;
                fileEntry.fileRef = fileRef;
            }
            
            return fileEntry;
        });

        return this.newFilesList;
    }

    cancelDownload(bucketId, fileId) {
        this.newFilesList = this.newFilesList.map(fileEntry => {
            if(fileEntry.getId() !== fileId) {
                fileEntry.isLoading = false;
                fileEntry.progress = 0;
            }          

            return fileEntry;
        });        
       
        return this.newFilesList;
    }

    cancelUpload(bucketId, fileId) {
        this.newFileUploadingList = this.newFileUploadingList.filter(fileEntry => {
            return fileEntry.getId() !== fileId                      
        });
       
        return this.newFilesList;
    }

    selectFile(file) {        
        return this._changeFileSelection(file.entity.id, true);
    }

    deselectFile(file) {
        return this._changeFileSelection(file.entity.id, false);
    }

    clearSelection() {
        this.newFilesList.forEach((file) => {
            file.isSelected = false;
        });

        return this.newFilesList;
    }

    _changeFileSelection(fileId, value) {
        this.newFilesList = this.newFilesList.map(file => {                
            if(file.getId() === fileId)
                file.isSelected = value;         
                
            return file;
        });

        return this.newFilesList;
    }    
}