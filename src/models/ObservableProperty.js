export class ObservableProperty {
    constructor(id, prop) {
        this.id = id;
        this.prop = prop;

        this.listeners = [];
    }

    get Property() {
        return this.prop;
    }

    set Property(value) {
        this.prop = value;

        this.notify();
    }

    addListener(listener) {
        if(!this._listenerContains(listener.id))
            this.listeners.push(listener);  
    }

    removeListener(listener) {
        let newArray = [];    

        for(let i = 0; i < this.listeners.length; i++) {
            if(this.listeners[i] !== listener.id)
                newArray.push(this.listeners[i]);
        }

        this.listeners = newArray;
    }

    notify() {
        this.listeners.forEach(listener => listener.callback(this.prop));
    }

    _listenerContains(id) {
        let contains = false;

        this.listeners.forEach(listener => {
            if(listener.id === id) 
                contains = true;
        });

        return contains;
    }
}

export class Listener {
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
    }
}

export const observablePropsFactory = (() => {
    let observables = [];

    /**
     * @param {string} observableId
     * @returns {ObservableProperty}
     */
    function getObservable(observableId) {
        let observable = observables.find(observable => observable.id === observableId);

        if(!observable) {
            observable = new ObservableProperty(observableId, null);
            observables.push(observable);
        }

        return observable;
    }

    function getCount() {
        return observables.length;
    }

    function clean() {
        observables = [];
    }

    return {
        getObservable,
        getCount,
        clean
    };

})();

export default observablePropsFactory;