import { FILE_ACTIONS } from '../../../utils/constants/actionConstants';

const { 
    LIST_FILES,
    UPLOAD_FILE_START,
    UPLOAD_FILE_SUCCESS,
    UPLOAD_FILE_ERROR,
    DOWNLOAD_FILE,
    DELETE_FILE, 
    SELECT_FILE, 
    DESELECT_FILE,
    UPDATE_FILE_UPLOAD_PROGRESS
} = FILE_ACTIONS;

/**
 * 
 * @param {string} bucketId 
 * @param {ListItemModel[]} files 
 */
function listFiles(bucketId, files) {
    return { type: LIST_FILES, payload: { bucketId, files } };
}

/**
 * @param {string} bucketId 
 * @param {ListItemModel} file
 */
function uploadFileStart(bucketId, file) {
    return { type: UPLOAD_FILE_START, payload: { bucketId, file } };
}

/**
 * 
 * @param {string} bucketId
 * @param {ListItemModel} file
 * @param {ListItemModel} filePath
 */
function uploadFileSuccess(bucketId, file, filePath) {
    return { type: UPLOAD_FILE_SUCCESS, payload: { bucketId, file, filePath } };
}

/**
 * 
 * @param {string} bucketId
 * @param {string} filePath
 */
function uploadFileError(bucketId, filePath) {
    return { type: UPLOAD_FILE_ERROR, payload: { bucketId, filePath } };
}

function updateFileUploadProgress(bucketId, filePath, progress) {
    return { type: UPDATE_FILE_UPLOAD_PROGRESS, payload: { bucketId, filePath, progress } }
}

//NOT IMPLEMENTED
function downloadFile() {
    return { type: DOWNLOAD_FILE };
}

function deleteFile(bucketId, fileId) {
    return { type: DELETE_FILE, payload: { bucketId, fileId } };
}

function selectFile(file) {
    return { type: SELECT_FILE, payload: { file } };
}

function deselectFile(file) {
    return { type: DESELECT_FILE, payload: { file } };
}

//list component
function enableSelectionMode() {
    return { type: ENABLE_SELECTION_MODE };
}

export const filesListContainerFileActions = {
    listFiles,
    selectFile,
    deselectFile
};

export const mainContainerFileActions = {
    uploadFileStart,
    uploadFileSuccess,
    uploadFileError,
    updateFileUploadProgress,
    deleteFile
};