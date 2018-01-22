export default class keysModel {
    /**
    * Describes auth file
    * @param {object} - auth file
    */
    constructor(keys) {
        if(
            keys.email
            && keys.password
            && keys.mnemonic
        ) {
            this.email = keys.email;
            this.password = keys.password;
            this.mnemonic = keys.mnemonic;
        } else {
            this.email = null;
            this.password = null;
            this.mnemonic = null;
        }
    };
}