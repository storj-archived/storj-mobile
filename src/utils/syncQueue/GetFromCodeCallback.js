const _queuedCallback = new WeakMap();
const _errorCallback = new WeakMap();
const _cancelledCallback = new WeakMap();
const _processingCallback = new WeakMap();
const _processedCallback = new WeakMap();
const _idleCallback = new WeakMap();
const _defaultCallback = new WeakMap();

const _emptyFunc = () => {};

function _initWithEmptyFunc(getFromCodeCallback) {
    _queuedCallback.set(getFromCodeCallback, _emptyFunc);
    _errorCallback.set(getFromCodeCallback, _emptyFunc);
    _cancelledCallback.set(getFromCodeCallback, _emptyFunc); 
    _processingCallback.set(getFromCodeCallback, _emptyFunc);
    _processedCallback.set(getFromCodeCallback, _emptyFunc);
    _idleCallback.set(getFromCodeCallback, _emptyFunc);
    _defaultCallback.set(getFromCodeCallback, _emptyFunc);
}

function _initWithBase(getFromCodeCallback, base) {
    getFromCodeCallback.QueuedCallback = base.queued;
    getFromCodeCallback.ErrorCallback = base.error;
    getFromCodeCallback.CancelledCallback = base.cancelled;
    getFromCodeCallback.ProcessingCallback = base.processing;
    getFromCodeCallback.ProcessedCallback = base.processed;
    getFromCodeCallback.IdleCallback = base.idle;
    getFromCodeCallback.DefaultCallback = base.default;
}

function _setCallback(callback, map) {
    if(callback.constructor === Function)
        map.set(this, callback);
}

export default class GetFromCodeCallback {
    constructor(base) {
        _initWithEmptyFunc(this);

        base ? _initWithBase(this, base) : (null);
    }

    queued() {
        return this.QueuedCallback();
    }
    error() {
        return this.ErrorCallback();
    }
    cancelled() {
        return this.CancelledCallback();
    }
    processing() {
        return this.ProcessingCallback();
    }
    processed() {
        return this.ProcessedCallback();
    }
    idle() {
        return this.IdleCallback();
    }
    default() {
        return this.DefaultCallback();
    }

    get QueuedCallback() {
        return _queuedCallback.get(this);
    }
    get ErrorCallback() {
        return _errorCallback.get(this);
    }
    get CancelledCallback() {
        return _cancelledCallback.get(this);
    }
    get ProcessingCallback() {
        return _processingCallback.get(this);
    }
    get ProcessedCallback() {
        return _processedCallback.get(this);
    }
    get IdleCallback() {
        return _idleCallback.get(this);
    }
    get DefaultCallback() {
        return _defaultCallback.get(this);
    }

    set QueuedCallback(callback) {
        _setCallback.call(this, callback, _queuedCallback);
    }
    set ErrorCallback(callback) {
        _setCallback.call(this, callback, _errorCallback);
    }
    set CancelledCallback(callback) {
        _setCallback.call(this, callback, _cancelledCallback);
    }
    set ProcessingCallback(callback) {
        _setCallback.call(this, callback, _processingCallback);
    }
    set ProcessedCallback(callback) {
        _setCallback.call(this, callback, _processedCallback);
    }
    set IdleCallback(callback) {
        _setCallback.call(this, callback, _idleCallback);
    }
    set DefaultCallback(callback) {
        _setCallback.call(this, callback, _defaultCallback);
    }
}