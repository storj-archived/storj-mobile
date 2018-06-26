import ListItemModel from '../../models/ListItemModel';

/**
 * Exposes methods to manage Buckets in reducer.
 */
export default class ItemManager {
    /**
     * @param {ListItemModel[]} itemList 
     * @param {*} selectedBuckets 
     */
    constructor(itemList, selectedBuckets) {
        this.selectedBuckets = selectedBuckets;
        this.itemList = itemList.slice();
    };

    /**
     * Change isSelected prop to value for selected item 
     * @param {ListItemModel} item selected item
     * @param {boolean} value value to set 
     * @returns {ListItemModel[]} 
     */
    changeItemSelectionStatus(item, value) {
        let index = this.itemList.indexOf(item);

        if(index > -1) {
            this.itemList[index].isSelected = value;
        }

        return this.itemList;
    };

    /**
     * Change isSelected prop to true for all buckets
     * @param {Array} filteredBuckets to select
     * @returns {ListItemModel[]} 
     */
    selectBuckets(filteredBuckets) {

        this.itemList = this.itemList.map(bucket => {
            for(let i = 0; i < filteredBuckets.length; i++) {

                if(bucket.entity.id === filteredBuckets[i].entity.id)
                    bucket.isSelected = true;
            }
            return bucket;
        });

        return this.itemList;
    };

    /**
     * Set isSelected prop of whole array to false
     * * @returns {ListItemModel[]}
     */
    clearSelection() {
        for(i = 0; i < this.itemList.length; i++) {
            this.itemList[i].isSelected = false;
        }

        return this.itemList;
    };

    /**
     * Add item to array
     * @param {ListItemModel} item
     * @returns {ListItemModel[]} 
     */
    addItem(item) {
        this.itemList.push(item);

        return this.itemList;
    };

    /**
     * Delete item from array
     * @param {ListItemModel} item
     * @returns {ListItemModel[]} 
     */
    deleteItem(itemId) {
        
        let index = this.itemList.map(item => item.getId()).indexOf(itemId);

        if(index > -1) {
            this.itemList.splice(index, 1);
        }

        return this.itemList;
    };

    /**
     * Updating isStarred property of selected buckets
     * @param {object[]} buckets to update starred status
     * @param {bool} starredStatus status update to
     * @returns updated buckets
     */
    updateStarred(buckets, starredStatus) {
        let idList = buckets.map(bucket => bucket.getId());

        this.itemList = this.itemList.map(item => {
            if(idList.includes(item.getId())) {                           
                item.entity.isStarred = starredStatus;
            }
            
            return item;
        });

        return this.itemList;
    }
}