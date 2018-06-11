import fileActions from "../mainContainer/Files/filesReducerActions";
import SyncModule from "../../utils/SyncModule";
import FileModel from "../../models/FileModel";
import ListItemModel from "../../models/ListItemModel";
import moment from 'moment';

export function uploadFileStart(fileHandle) {
    return async (dispatch) => {
        let getFileResponse = await SyncModule.getUploadingFile(fileHandle);
        
        if(getFileResponse.isSuccess) {
            let uploadingFile = JSON.parse(getFileResponse.result);

            let fileModel = new FileModel({ 
                name: uploadingFile.name, 
                fileId: uploadingFile.fileHandle,
                created: moment().format(),
                erasure: null,
                hmac: null,
                index: null,
                mimeType: null,
                size: uploadingFile.size,
                bucketId: uploadingFile.bucketId
            });

            let listItem = new ListItemModel(fileModel, false, true);
            dispatch(fileActions.uploadFileStart(uploadingFile.bucketId, listItem));
        }
    };
}

export function uploadFileSuccess(fileHandle, fileId) {
    return async (dispatch) => {
        let getFileResponse = await SyncModule.getFile(fileId);

        if(getFileResponse.isSuccess) {
            let file = JSON.parse(getFileResponse.result);
            dispatch(fileActions.uploadFileSuccess(file.bucketId, new ListItemModel(new FileModel(file)), fileHandle));
        }
    };
}

export function listUploadingFiles(bucketId) {
    return async (dispatch) => {
        let listUploadingFilesResponse = await SyncModule.listUploadingFiles(bucketId);

        if(listUploadingFilesResponse.isSuccess) {
            let uploadingFiles = JSON.parse(listUploadingFilesResponse.result);
            
            uploadingFiles = uploadingFiles.map(uploadingFile => {

                let fileModel = new FileModel({ 
                    name: uploadingFile.name, 
                    fileId: uploadingFile.fileHandle,
                    created: moment().format(),
                    erasure: null,
                    hmac: null,
                    index: null,
                    mimeType: null,
                    size: uploadingFile.size,
                    bucketId: uploadingFile.bucketId
                });

                return new ListItemModel(fileModel, false, true);
            });
            
            dispatch(fileActions.listUploadingFiles(uploadingFiles));
        }
    };
}

export function listFiles(bucketId) {
    return async (dispatch) => {
        let listFilesResponse = await SyncModule.listFiles(bucketId);

        if(listFilesResponse.isSuccess) {
            let files = JSON.parse(listFilesResponse.result);
            files = files.map(file => new ListItemModel(new FileModel(file)));

            dispatch(fileActions.listFiles(bucketId, files));
        }

        return listFilesResponse; 
    }
}