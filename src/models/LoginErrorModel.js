export class LoginErrorModel {
    /**
    * Error model used for indication validation errors in LoginContainer. For internal usage, not for reducer or store
    * @param {bool} - isEmailError
    * @param {bool} - isPasswordError
    * @param {bool} - isMnemonicError
    * @param {bool} - isCredentialsError
    */
    constructor(isEmailError=false, isPasswordError=false, isMnemonicError=false, isCredentialsError=false) {
        this.isEmailError = isEmailError;
        this.isPasswordError = isPasswordError;
        this.isMnemonicError = isMnemonicError;
        this.isCredentialsError = isCredentialsError;
    };
}