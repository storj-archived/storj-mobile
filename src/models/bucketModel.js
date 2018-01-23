export default class BucketModel {
    /**
    * Describes bucket entity
    * @param {object} - bucket
    */
    constructor(bucket) {
        this.name = null;
        this.id = null;
        this.hash = 0;
        this.isDecrypted = false;
        this.created = null;
        this.isSelected = false;

        if(
            bucket
            && bucket.name
            && bucket.id
            && Number.isInteger(bucket.hash)
            && typeof(bucket.isDecrypted) === "boolean"
            && bucket.created
        ) {
            this.name = bucket.name;
            this.id = bucket.id;
            this.hash = bucket.hash;
            this.isDecrypted = bucket.isDecrypted;
            this.created = bucket.created;
            this.isSelected = false;
        } 
    };
}