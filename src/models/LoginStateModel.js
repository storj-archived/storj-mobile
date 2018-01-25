export class LoginStateModel {
    /**
    * State model used for storing email and password in LoginContainer. For internal usage, not for reducer or store
    * @param {string} email
    * @param {string} password
    * @param {string} mnemonic
    */
    constructor(email, password, mnemonic) {
        this.email = email ? email : '';
        this.password = password ? password : '';
        this.mnemonic = mnemonic ? mnemonic : '';
    };

    /**
     * Helper function for comparing two instances. Returns false
     *  if object properties differs from those described in this model.
     * @param {LoginStateModel} stateModel 
     * @returns {Boolean} 
     */
    isEqualTo(stateModel) {
        let props = Object.getOwnPropertyNames(stateModel);

        if(!(props.length === 3 && props.includes('email', 'password', 'mnemonic')))
            return false;          
            
        return(
            stateModel.email === this.email 
            && stateModel.password === this.password
            && stateModel.mnemonic === this.mnemonic
        );
    };
}