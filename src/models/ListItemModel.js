export default class ListItemModel {
    /**
    * Describes list item
    * @param {object} item selected entity that should be handled
    * @param {string} mainTitlePath path to property of object, that should be displayed as main title. F.e. name.
    * @param {string} idPath path to the unique identificator of object
    * @param {string[]} sortingOptions path to properties of object, that should be used for sorting
    * @param {bool} isSelected indicates if item is selected
    */
    constructor(item, mainTitlePath, idPath, sortingOptions, isSelected = false) {
        this.entity = item;
        this.isSelected = isSelected;

        this.mainTitlePath = mainTitlePath;
        this.sortOptions = sortingOptions;
        this.idPath = idPath;
    };
}