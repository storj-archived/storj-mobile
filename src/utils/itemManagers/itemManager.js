import ListItemModel from '../../models/ListItemModel';
import { includes } from "../utils"

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
        let length = this.itemList.length;
        let idArray = [];
        let itemId = item.getId();

        for(let i = 0; i < length; i++) {
            idArray.push(this.itemList[i].getId());
        }

        if(includes(idArray, itemId)) {
            for(let j = 0; j < length; j++) {
                let bucket = this.itemList[j];
                
                if(bucket.getId() === itemId)
                    bucket.isSelected = value;
            }
        }

        return this.itemList;
    };

    /**
     * Change isSelected prop to true for all buckets
     * @param {Array} filteredBuckets to select
     * @returns {ListItemModel[]} 
     */
    selectBuckets(filteredBuckets) {
        let resultArray = [];
        let length = this.itemList.length;

        for(let i = 0; i < length; i++) {
            let bucket = this.itemList[i];

            for(let j = 0; j < filteredBuckets.length; j++) {

                if(bucket.entity.id === filteredBuckets[j].entity.id)
                    bucket.isSelected = true;
            }

            resultArray.push(bucket);
        }

        return resultArray;
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
        let length = this.itemList.length;
        let idArray = new Array(length);

        for(let i = 0; i < length; i++) {
            idArray[i] = this.itemList[i].getId();
        }

        let index = idArray.indexOf(itemId)

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
        let bucketsLength = buckets.length;
        
        let idArray = new Array(bucketsLength);
        

        for(let i = 0; i < bucketsLength; i++) {
            idArray[i] = buckets[i].getId();
        }

        let length = this.itemList.length;
        let resultArray = new Array(length);

        for(let i = 0; i < length; i++) {
            let item = this.itemList[i];

            if(idArray.includes(item.getId())) {                           
                item.entity.isStarred = starredStatus;
            }

            resultArray[i] = item;
        }

        return resultArray;
    }
}