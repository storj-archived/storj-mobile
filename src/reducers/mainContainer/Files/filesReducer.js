import FileModel from '../../../models/FileModel';
import ListItemModel from '../../../models/ListItemModel';
import { FILE_ACTIONS } from '../../../utils/constants/actionConstants';

const { 
    LIST_FILES,
    UPLOAD_FILE,
    DOWNLOAD_FILE,
    DELETE_FILE, 
    SELECT_FILE, 
    DESELECT_FILE 
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
            break;
        case DESELECT_FILE: 
            break;
        default:
            return state || initialState;
    }

    return newState;
}

class FileListModel {
    /**
     * @param {string} bucketId 
     * @param {ListItemModel[]} files 
     */
    constructor(bucketId = null, files = []) {
        this.bucketId = bucketId;
        this.files = files;
    }
}

class FileListManager {
    /**
     * 
     * @param {FileListModel} filesList 
     */
    constructor(filesList) {
        this.newFilesList = filesList.map(item => new FileListModel(item.bucketId, item.files));
    }

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

    changeFileSelection(bucketId, fileId, value) {
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