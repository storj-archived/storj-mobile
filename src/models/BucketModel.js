import ItemModel from './ItemModel';

export default class BucketModel extends ItemModel {
    /**
    * Describes bucket entity
    * @param {object} bucket
    */
    constructor(bucket) {
        if( bucket
            && bucket.name
            && bucket.id
            && Number.isInteger(bucket.hash)
            && typeof(bucket.isDecrypted) === "boolean"
            && bucket.created) {

            super(bucket.name, bucket.id, bucket.created);
            
            this.hash = bucket.hash;
            this.isDecrypted = bucket.isDecrypted;
            this.created = bucket.created;
        } else {
            super();

            this.hash = 0;
            this.isDecrypted = false;
            this.created = null;
        }
    };
}