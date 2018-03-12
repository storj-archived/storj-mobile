import fileActions from "../mainContainer/Files/filesReducerActions";
import SyncModule from "../../utils/SyncModule";
import FileModel from "../../models/FileModel";
import ListItemModel from "../../models/ListItemModel";

export function uploadFileStart(fileHandle) {
    // We return a function instead of an action object
    return async (dispatch) => {
        let getFileResponse = await SyncModule.getUploadingFile(fileHandle);
        console.log("GET UPLOADING FILEEEEEE", getFileResponse.isSuccess);
        if(getFileResponse.isSuccess) {
            let uploadingFile = JSON.parse(getFileResponse.result);
            console.log(uploadingFile);

            let fileModel = new FileModel({ 
                name: uploadingFile.name, 
                fileId: uploadingFile.fileHandle,
                created: new Date().toLocaleString(),
                erasure: null,
                hmac: null,
                index: null,
                mimeType: null,
                size: uploadingFile.size,
                bucketId: uploadingFile.bucketId
            });

            let listItem = new ListItemModel(fileModel, false, true);
            console.log("listItem", listItem);
            dispatch(fileActions.uploadFileStart(uploadingFile.bucketId, listItem));
        }
    };
}

export function uploadFileSuccess(fileHandle, fileId) {
    // We return a function instead of an action object
    return async (dispatch) => {
        let getFileResponse = await SyncModule.getFile(fileId);
        console.log("GET FILEEEEEE", getFileResponse.isSuccess);
        if(getFileResponse.isSuccess) {
            let file = JSON.parse(getFileResponse.result);
            console.log(file);
            dispatch(fileActions.uploadFileSuccess(file.bucketId, new ListItemModel(new FileModel(file)), fileHandle));

            //bucketId, file, filePath
        }
    };
}