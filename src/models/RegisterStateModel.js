export class RegisterStateModel {
    /**
    * State model used for storing email and password in registerContainer. For internal usage, not for reducer or store
    * @param {string} - email
    * @param {string} - password
    * @param {string} - mnemonic
    * @param {string} - passwordRepeat
    */
    constructor(email = '', password = '', passwordRepeat = '', areTermsAccepted = false) {
        this.email = email;
        this.password = password;
        this.passwordRepeat = passwordRepeat;
        this.areTermsAccepted = areTermsAccepted;
    }

    /**
     * Helper function for comparing two instances. Returns false
     * if object properties differs from those described in this model.
     * @param {RegisterStateModel} stateModel 
     * @returns {Boolean} 
     */
    isEqualTo(stateModel) {
        let props = Object.getOwnPropertyNames(stateModel);

        if(!(props.length === 4 && props.includes('email', 'password', 'areTermsAccepted', 'passwordRepeat')))
            return false;          
            
        return(
            stateModel.email === this.email 
            && stateModel.password === this.password
            && stateModel.areTermsAccepted === this.areTermsAccepted
            && stateModel.passwordRepeat === this.passwordRepeat
        );
    };
}