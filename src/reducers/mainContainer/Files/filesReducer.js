import FileListModel from '../../../models/FileListModel';
import FileListManager from '../../../utils/itemManagers/FileListManager';
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
 * InitialState
 * @property {FileListModel[]} fileListModels
 */
const initialState = {
    fileListModels: [],
    uploadingFileListModels: []
};

export default function filesReducer(state = initialState, action) {
    let newState = Object.assign({}, state);
    let filesManager = new FileListManager(newState.fileListModels, newState.uploadingFileListModels);

    switch(action.type) {
        case LIST_FILES:
            newState.fileListModels = filesManager.listFiles(action.payload.bucketId, action.payload.files);
            break;
        case UPLOAD_FILE_START:
            newState.uploadingFileListModels = filesManager.addFileEntryU(action.payload.bucketId, action.payload.file);
            break;
        case UPLOAD_FILE_SUCCESS:
            newState.uploadingFileListModels = filesManager.deleteFileEntryU(action.payload.bucketId, action.payload.filePath);
            newState.fileListModels = filesManager.addFileEntry(action.payload.bucketId, action.payload.file);
            break;
        case UPLOAD_FILE_ERROR:
            newState.uploadingFileListModels = filesManager.deleteFileEntryU(action.payload.bucketId, action.payload.filePath);
            break;
        case UPDATE_FILE_UPLOAD_PROGRESS: 
            newState.uploadingFileListModels = filesManager.updateFileUploadingProgress(action.payload.bucketId, action.payload.filePath, action.payload.progress);
            break;
        case DELETE_FILE:
            newState.fileListModels = filesManager.deleteFileEntry(action.payload.bucketId, action.payload.fileId);
            break;
        case SELECT_FILE: 
            newState.fileListModels = filesManager.selectFile(action.payload.file);
            break;
        case DESELECT_FILE:
            newState.fileListModels = filesManager.deselectFile(action.payload.file);
            break;
        default:
            return state || initialState;
    }

    return newState;
}
