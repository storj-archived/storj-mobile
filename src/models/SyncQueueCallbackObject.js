const _syncQueueEntry = new WeakMap();
const _callbackObject = new WeakMap();
const _emptyFunc = () => {};

function _checkCallBack(callbackObject) {
    if(!callbackObject.queued) callbackObject.queued = _emptyFunc;
    if(!callbackObject.error) callbackObject.error = _emptyFunc;
    if(!callbackObject.cancelled) callbackObject.cancelled = _emptyFunc;
    if(!callbackObject.processing) callbackObject.processing = _emptyFunc;
    if(!callbackObject.processed) callbackObject.processed = _emptyFunc;
    if(!callbackObject.idle) callbackObject.idle = _emptyFunc;

    return callbackObject;
}

export default class SyncQueueCallbackObject {
    constructor(syncQueueEntry) {
        _syncQueueEntry.set(this, syncQueueEntry);
    }

    get Queued() {
        if(!this.isValid) 
            return _emptyFunc;
        
        return () => this.CallbackObject.queued(this.SyncQueueEntry);
    }

    get Error() {
        if(!this.isValid) 
            return _emptyFunc;
        
        return () => this.CallbackObject.error(this.SyncQueueEntry);
    }

    get Cancelled() {
        if(!this.isValid) 
            return _emptyFunc;

        return () => this.CallbackObject.cancelled(this.SyncQueueEntry);
    }

    get Processing() {
        if(!this.isValid)
            return _emptyFunc;
        
        return () => this.CallbackObject.processing(this.SyncQueueEntry);
    }

    get Processed() {
        if(!this.isValid)
            return _emptyFunc;
        
        return () => this.CallbackObject.processed(this.SyncQueueEntry);
    }

    get Idle() {
        if(!this.isValid)
            return _emptyFunc;
        
        return () => this.CallbackObject.idle(this.SyncQueueEntry);
    }

    get SyncQueueEntry() {
        return _syncQueueEntry.get(this);
    }
    set SyncQueueEntry(syncQueueEntry) {
        if(syncQueueEntry && syncQueueEntry.isValid)
            _syncQueueEntry.set(this, syncQueueEntry);
    }

    get CallbackObject() {
        return _callbackObject.get(SyncQueueCallbackObject);
    }
    static set CallbackObject(callbackObject) {
        console.log(callbackObject);
        _callbackObject.set(SyncQueueCallbackObject, _checkCallBack(callbackObject));
    }

    isValid = () => this.SyncQueueEntry && this.CallbackObject;
}