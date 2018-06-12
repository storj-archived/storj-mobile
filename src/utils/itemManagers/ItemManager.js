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
     * @returns {ListItemModel[]} 
     */
    selectBuckets(isFavorites, searchSequence) {

        if(!isFavorites) {
            this.itemList = this.itemList.map((bucket) => {
                if(bucket.entity.name.toLowerCase().includes(searchSequence.toLowerCase())) bucket.isSelected = true;
                return bucket;
            })

            return this.itemList;
        }

        this.itemList = this.itemList.map((bucket) => {
            if (bucket.getStarred() && 
                bucket.entity.name.toLowerCase()
                .includes(searchSequence.toLowerCase())) 
                    bucket.isSelected = true;
            
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

    //TODO: delete, depreciated
    _selectBucket(bucketId) {
        let isBucketSelected = false;

        for(let i = 0; i < this.selectedBuckets.length; i++) {
            if(this.selectedBuckets[i] === bucketId) isBucketSelected = true;
        };

        if(!isBucketSelected)
            this.selectedBuckets.push(bucketId);

        return this.selectedBuckets;
    };

    //TODO: delete, depreciated
    _deselectBucket(bucketId) {
        let index = this.selectedBuckets.indexOf(bucketId);
            
        if(index > -1) {
            this.selectedBuckets.splice(index, 1);
        }

        return this.selectedBuckets;
    };
}