export class RegisterErrorModel {
    /**
    * Error model used for indication validation errors in RegisterContainer. For internal usage, not for reducer or store
    * @param {boolean} isEmailError
    * @param {boolean} isPasswordError
    * @param {boolean} isPasswordMatchError - occurs when password and repeat password doesn't match
    * @param {boolean} isTermsAcceptedError
    */
    constructor(isEmailError = false, isPasswordError = false, isPasswordMatchError = false, isTermsAcceptedError = false) {
        this.isEmailError = isEmailError;
        this.isPasswordError = isPasswordError;
        this.isPasswordMatchError = isPasswordMatchError;
        this.isTermsAcceptedError = isTermsAcceptedError;
    };
}