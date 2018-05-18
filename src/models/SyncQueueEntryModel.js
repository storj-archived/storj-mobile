import ItemModel from "./ItemModel";

export default class SyncQueueEntryModel extends ItemModel {
    constructor(id, fileName, localPath, status, errorCode, size, count, creationDate, bucketId, fileHandle) {
        super(fileName, id, creationDate, false, false);
        this.localPath = localPath;
        this.status = status;
        this.errorCode = errorCode;
        this.size = size;
        this.count = count;
        this.bucketId = bucketId;
        this.fileHandle = fileHandle;
    }

    static fromModel(syncQueueEntryModel) {
        console.log("formModel", syncQueueEntryModel);
        return new SyncQueueEntryModel(
            syncQueueEntryModel._id,
            syncQueueEntryModel.fileName,
            syncQueueEntryModel.localPath,
            syncQueueEntryModel.status,
            syncQueueEntryModel.errorCode,
            syncQueueEntryModel.size,
            syncQueueEntryModel.count,
            syncQueueEntryModel.creationDate,
            syncQueueEntryModel.bucketId,
            syncQueueEntryModel.fileHandle
        );
    }
}