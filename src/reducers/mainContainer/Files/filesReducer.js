import FileListModel from '../../../models/FileListModel';
import FileListManager from '../../../utils/itemManagers/FileListManager';
import { FILE_ACTIONS } from '../../../utils/constants/actionConstants';

const { 
    LIST_FILES,
    UPLOAD_FILE,
    DOWNLOAD_FILE,
    DELETE_FILE, 
    SELECT_FILE, 
    DESELECT_FILE,
    ENABLE_SELECTION_MODE
} = FILE_ACTIONS;


/**
 * InitialState
 * @property {FileListModel[]} fileListModels
 */
const initialState = {
    fileListModels: []
};

export default function filesReducer(state = initialState, action) {
    let newState = Object.assign({}, state);
    let filesManager = new FileListManager(newState.fileListModels);

    switch(action.type) {
        case LIST_FILES:
            newState.fileListModels = filesManager.listFiles(action.payload.bucketId, action.payload.files);
            break;
        case UPLOAD_FILE:
            newState.fileListModels = filesManager.uploadFile(action.payload.bucketId, action.payload.file);
            break;
        case DELETE_FILE:
            newState.fileListModels = filesManager.deleteFile(action.payload.bucketId, action.payload.fileId);
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


