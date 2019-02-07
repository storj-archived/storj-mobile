import ListItemModel from '../../models/ListItemModel';
import FileListModel from '../../models/FileListModel';
import { includes } from "../utils"

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
    addFileEntry(file) {
        return this._addFileEntry(this.newFilesList, file);
    }

    /**
     * Adding uploading file
     * @param {string} bucketId 
     * @param {object} file
     */
    addFileEntryU(file) {
        return this._addFileEntry(this.newFileUploadingList, file);
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
        let fileIds = [];
        let filesLength = files.length;

        for(let i = 0; i < filesLength; i++) {
            fileIds.push(files[i].getId());
        };

        let resultArray = [];
        let newFilesListLength = this.newFilesList.length;

        for(let i = 0; i < newFilesListLength; i++) {
            var temp = this.newFilesList[i];

            if(includes(fileIds, temp.getId())) { 
                temp.entity.isStarred = starredStatus;
            }

            resultArray.push(temp);
        }

        return resultArray;
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
        let resultArray = [];
        let newFileUploadingListLength = this.newFileUploadingList.length;

        for(let i = 0; i < newFileUploadingListLength; i++) {
            var temp = this.newFileUploadingList[i];

            if(temp.getId() !== id) {
                resultArray.push(temp);
            }
        }

        return resultArray;
    }

    /**
     * @param {FileListModel[]} array
     * @param {ListItemModel} file 
     */
    _addFileEntry(array, file) {
        let arrayLength = array.length;
        let doesContain = false;
        
        for(let i = 0; i < arrayLength; i++) {
            if (array[i].getId() === file.getId()) {
                doesContain = true;
                break;
            }
        }

        if(!doesContain) {
            array.push(file);
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
        let resultArray = [];
        let arrayLength = array.length;

        for(let i = 0; i < arrayLength; i++) {
            let temp = array[i];

            if(temp.getId() === id) {
                temp.entity = file.entity;
                temp.isLoading = false;    
            }

            resultArray.push(temp);
        }

        return resultArray;
    }

    /**
     * 
     * @param {string} bucketId 
     * @param {string} fileId 
     */
    _deleteFileEntry(array, bucketId, fileId) {
        let resultArray = [];
        let length = array.length;

        for(let i = 0; i < length; i++) {
            let temp = array[i];
            if(temp.getId() !== fileId && temp.entity.bucketId === bucketId) {
                resultArray.push(temp);
            } 
        }

        return resultArray;
    }

    /**
     * 
     * @param {string} bucketId 
     * @param {ListItemModel[]} files 
     */
    listFiles(bucketId, files) {
        let tempFilesArray = [];
        newFilesListLength = this.newFilesList.length;

        for(let i = 0; i < newFilesListLength; i++) {
            let temp = this.newFilesList[i];
            if(temp.entity.bucketId !== bucketId) tempFilesArray.push(temp);
        }
        
        Array.prototype.push.apply(tempFilesArray, files);

        return tempFilesArray;
    }

    /**
     * Retrieve list of uploading files from selected bucket
     */
    listUploadingFiles() {
        return this.newFileUploadingList;
    }


    update(id, progress, uploaded) {
        let resultArray = [];
        let length = this.newFileUploadingList.length;

        for(let i = 0; i < length; i++) {
            var temp = this.newFileUploadingList[i];

            if (temp.getId() === id) {
                temp.progress = progress;
                temp.fileRef = id;
            }  

            resultArray.push(temp);
        }

        return resultArray;
    }

    /**
     * Updating file after downloading
     * @param {string} bucketId 
     * @param {string} fileId 
     * @param {string} localPath 
     * @param {string} thumbnail 
     */
    fileDownloaded(fileId, localPath, thumbnail) {
        let resultArray = [];
        let length = this.newFilesList.length;

        for(let i = 0; i < length; i++) {
            if(this.newFilesList[i].getId() === fileId){
                this.newFilesList[i].isLoading = false;
                this.newFilesList[i].progress = 0;
                this.newFilesList[i].entity.localPath = localPath;
                this.newFilesList[i].entity.isDownloaded = !!localPath;
                this.newFilesList[i].entity.thumbnail = thumbnail;
            }  

            resultArray.push(this.newFilesList[i]);
        }

        return resultArray;
    }

    /**
     * Updating progress of downloading file
     * @param {string} bucketId 
     * @param {string} fileId 
     * @param {double} progress 
     * @param {double} fileRef 
     */
    updateFileDownloadingProgress(fileId, progress, fileRef) {
        let resultArray = [];
        let length = this.newFilesList.length;

        for(let i = 0; i < length; i++) {
            var temp = this.newFilesList[i];

            if (temp.getId() === fileId) {
                temp.isLoading = true;
                temp.progress = progress;
                temp.fileRef = fileRef;
            }  

            resultArray.push(temp);
        }

        return resultArray;
    }

    /**
     * Updating file after cancelling download
     * @param {string} fileId 
     */
    cancelDownload(fileId) {
        let resultArray = [];
        let length = this.newFilesList.length;

        for(let i = 0; i < length; i++) {
            var temp = this.newFilesList[i];

            if(temp.getId() === fileId){
                temp.isLoading = false;
                temp.progress = 0;
            }  

            resultArray.push(temp);
        }

        return resultArray;
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
    selectFiles(filteredFiles) {        
        return this._changeFilesSelection(filteredFiles);
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
        let resultArray = [];
        let length = this.newFilesList.length;

        for (let i = 0; i < length; i++) {
            var temp = this.newFilesList[i];
            temp.isSelected = false;
            resultArray.push(temp);
        }

        return resultArray;
    }

    /**
     * Updating file isSelected prop
     * @param {string} fileId 
     * @param {bool} value 
     */
    _changeFileSelection(fileId, value) {
        let resultArray = [];
        let length = this.newFilesList.length;

        for (let i = 0; i < length; i++) {
            var temp = this.newFilesList[i];

            if (temp.getId() === fileId) {
                temp.isSelected = value; 
            }  

            resultArray.push(this.newFilesList[i]);
        }

        return resultArray;
    }    

    /**
     * Setting file as selected depends on bucket id and searchSequence
     * @param {array} filteredFiles to select
     * @returns updated list of files
     */
    _changeFilesSelection(filteredFiles) {
        let resultArray = [];
        let length = this.newFilesList.length;

        for(let i = 0; i < length; i++) {
            var temp = this.newFilesList[i];

            for(let j = 0; j < filteredFiles.length; j++) {
                if (temp.entity.id === filteredFiles[j].entity.id)
                    temp.isSelected = true;
            } 

            resultArray.push(temp);
        }

        return resultArray;
    }    
}