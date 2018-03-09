import ItemModel from '../models/ItemModel';

export default class ListItemModel {
    /**
    * Describes list item
    * @param {ItemModel} item selected entity that should be handled
    * @param {boolean} isSelected indicates if item is selected
    * @param {boolean} isLoading
    */
    constructor(item, isSelected = false, isLoading = false) {
        this.entity = item;
        this.isSelected = isSelected;
        this.isLoading = isLoading;
        this.sortOrder = 0;
        this.progress = 0;
        this.fileRef = 0;
    };

    get Progress() {
        return this.progress;
    }

    set Progress(value) {
        if(Number.isInteger(value))
            this.progress = value;
    }
    /**
     * Get entity name
     * @returns {string}
     */
    getName() {
        return this.entity.Name;
    };

    /**
     * Get entity id
     * @returns {string}
     */
    getId() {
        return this.entity.Id;
    };

    /**
     * Get entity date
     * @returns {string}
     */
    getDate() {
        return this.entity.Date;
    };

    /**
     * Get entity date
     * @returns {string}
     */
    getStarred() {
        return this.entity.isStarred;
    };
}