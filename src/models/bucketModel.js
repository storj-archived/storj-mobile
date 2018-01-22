export default class BucketModel {
    /**
    * Describes bucket entity
    * @param {object} - bucket
    */
    constructor(bucket) {
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
        } else {
            this.name = null;
            this.id = null;
            this.hash = 0;
            this.isDecrypted = false;
            this.created = null;
        }
    };
}