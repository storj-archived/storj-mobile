import ItemModel from '../models/ItemModel';

export default class ListItemModel {
    /**
    * Describes list item
    * @param {ItemModel} item selected entity that should be handled
    * @param {boolean} isSelected indicates if item is selected
    */
    constructor(item, isSelected = false) {
        this.entity = item;
        this.isSelected = isSelected;
        this.sortOrder = 0;
    };

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
     * Get entity id
     * @returns {string}
     */
    getDate() {
        return this.entity.Date;
    };
}