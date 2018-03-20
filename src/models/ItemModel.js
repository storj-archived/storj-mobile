/**
 * Abstract Item Model class do not instantiate
 */
export default class ItemModel {
    /**
     * 
     * @param {string} name 
     * @param {string} id 
     * @param {string} date
     * @param {bool} isStarred
     * @param {bool} isSynced
     */
    constructor(name = null, id = null, date = null, isStarred = false, isSynced = false) {
        this.name = name;
        this.id = id;
        this.date = date;
        this.isStarred = isStarred;
        this.isSynced = isSynced;
    };

    /**
     * get public name property
     * @returns {string}
     */
    get Name() {
        return this.name;
    };

    /**
     * set public name property
     */
    set Name(value) {};

    /**
     * get public id property
     * @returns {string}
     */
    get Id() {
        return this.id;
    };

    /**
     * set public id property
     */
    set Id(value) {};

    /**
     * get public date property
     * @returns {string}
     */
    get Date() {
        return this.date;
    };

    /**
     * set public date property
     */
    set Date(value) {};

    /**
     * get public isStarred property
     */
    get IsStarred() {
        return this.isStarred;
    }

    /**
     * set public isStarred property
     */
    set IsStarred(value) {};

    /**
     * get public isSynced property
     */
    get IsSynced() {
        return this.isSynced;
    }

    /**
     * set public isSynced property
     */
    set IsSynced(value) {};
}