/**
 * Abstract Item Model class do not instantiate
 */
export default class ItemModel {
    /**
     * 
     * @param {string} name 
     * @param {string} id 
     * @param {string} date
     */
    constructor(name = null, id = null, date = null) {
        this.name = name;
        this.id = id;
        this.date = date;
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
}