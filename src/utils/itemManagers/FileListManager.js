import ListItemModel from '../../models/ListItemModel';
import FileListModel from '../../models/FileListModel';

/**
 * Exposes methods to manage Files in reducer.
 */
export default class FileListManager {
    /**
     * 
     * @param {FileListModel[]} filesList 
     * @param {FileListModel[]} uploadingFileList 
     */
    constructor(filesList, uploadingFileList) {
        this.newFilesList = filesList;
        this.newFileUploadingList = uploadingFileList;
    }

    /**
     * Adding file
     * @param {string} bucketId 
     * @param {object} file
     */
    addFileEntry(bucketId, file) {
        return this._addFileEntry(this.newFilesList, bucketId, file);
    }

    /**
     * Adding uploading file
     * @param {string} bucketId 
     * @param {object} file
     */
    addFileEntryU(bucketId, file) {
        return this._addFileEntry(this.newFileUploadingList, bucketId, file);
    }

    //--------------------------------------------------------------------------
    /**
     * Updating file
     * @param {string} bucketId 
     * @param {object} file
     * @param {string} id 
     */
    updateFileEntry(bucketId, file, id) {
        return this._updateFileEntry(this.newFilesList, bucketId, file, id);
    }

    /**
     * Updating uploading file file
     * @param {string} bucketId 
     * @param {object} file
     * @param {string} id 
     */
    updateFileEntryU(bucketId, file, id) {
        return this._updateFileEntry(this.newFileUploadingList, bucketId, file, id);
    }

    /**
     * Updating files starred prop 
     * @param {object[]} files to update starred status
     * @param {bool} starredStatus status update to
     * @returns updated status
     */
    updateFileStarred(files, starredStatus) {        
        let fileIds = files.map(file => file.getId());
        
        this.newFilesList = this.newFilesList.map(file => {
            if(fileIds.includes(file.getId())) { 
                file.entity.isStarred = starredStatus;
            }   

            return file;
        });

        return this.newFilesList;
    }

    //------------------------------------------------------------------------
    /**
     * Deleting file
     * @param {string} bucketId 
     * @param {string} fileId 
     */
    deleteFileEntry(bucketId, fileId) {
        return this._deleteFileEntry(this.newFilesList, bucketId, fileId);
    }

    /**
     * Deleting uploading file
     * @param {string} bucketId 
     * @param {string} fileId 
     */
    deleteFileEntryU(bucketId, fileId) {
        return this._deleteFileEntry(this.newFileUploadingList, bucketId, fileId);
    }

    /**
     * removing file by id
     * @param {string} id 
     */
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

    /**
     * Retrieve list of uploading files from selected bucket
     * @param {string} bucketId 
     * @param {object[]} files 
     */
    listUploadingFiles(bucketId, files) {
        let names = files.map(file => file.getName());
        let tempFilesArray = this.newFileUploadingList.filter(file => file.entity.bucketId === bucketId);        

        let newArray = tempFilesArray.filter(file => !names.includes(file.getName)).concat(this.newFileUploadingList.filter(file => file.entity.bucketId !== bucketId));

        return this.newFileUploadingList;
    }
    
    /**
     * Initializes uploading files
     * @param {object[]} files 
     */
    getUploadingFiles(files) {
        this.newFileUploadingList = files.slice();

        return this.newFileUploadingList;
    }

    /**
     * Updating propgress for uploading file
     * @param {string} bucketId 
     * @param {string} fileId 
     * @param {double} progress 
     * @param {double} fileRef reference of file, used to cancel upload
     */
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

    /**
     * Updating file after downloading
     * @param {string} bucketId 
     * @param {string} fileId 
     * @param {string} localPath 
     * @param {string} thumbnail 
     */
    fileDownloaded(bucketId, fileId, localPath, thumbnail) {
        this.newFilesList = this.newFilesList.map(fileEntry => {
            if(fileEntry.getId() === fileId) {
                fileEntry.isLoading = false;
                fileEntry.progress = 0;
                fileEntry.entity.localPath = localPath;
                fileEntry.entity.isDownloaded = localPath ? true : false;
                fileEntry.entity.thumbnail = thumbnail;
            }
            
            return fileEntry;
        });
    
        return this.newFilesList;
    }

    /**
     * Updating progress of downloading file
     * @param {string} bucketId 
     * @param {string} fileId 
     * @param {double} progress 
     * @param {double} fileRef 
     */
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

    /**
     * Updating file after cancelling download
     * @param {string} bucketId 
     * @param {string} fileId 
     */
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

    /**
     * Updating file after cancelling upload
     * @param {string} bucketId 
     * @param {string} fileId 
     */
    cancelUpload(bucketId, fileId) {
        this.newFileUploadingList = this.newFileUploadingList.filter(fileEntry => {
            return fileEntry.getId() !== fileId                      
        });
       
        return this.newFilesList;
    }

    /**
     * Selecting file
     * @param {object} file
     */
    selectFile(file) {        
        return this._changeFileSelection(file.entity.id, true);
    }

    /**
     * Selecting files
     * @param {object} files
     */
    selectFiles(bucketId) {        
        return this._changeFilesSelection(bucketId, true);
    }

    /**
     * Deselecting file
     * @param {object} file
     */
    deselectFile(file) {
        return this._changeFileSelection(file.entity.id, false);
    }

    /**
     * Deselecting all files
     */
    clearSelection() {
        this.newFilesList.forEach((file) => {
            file.isSelected = false;
        });

        return this.newFilesList;
    }

    /**
     * Updating file isSelected prop
     * @param {string} fileId 
     * @param {bool} value 
     */
    _changeFileSelection(fileId, value) {
        this.newFilesList = this.newFilesList.map(file => {                
            if(file.getId() === fileId)
                file.isSelected = value;         
                
            return file;
        });

        return this.newFilesList;
    }    

    /**
     * Updating files isSelected prop
     * @param {string} bucketId 
     * @param {bool} value 
     */
    _changeFilesSelection(bucketId, value) {
        this.newFilesList = this.newFilesList.map(file => {
            if(file.entity.bucketId === bucketId) {
                file.isSelected = value;  
            }

            return file;
        });
        
        return this.newFilesList;
    }    
}