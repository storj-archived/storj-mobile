import { AsyncStorage } from 'react-native';

const storageConstants = {
    EMAIL: 'EMAIL',
    PASSWORD: 'PASSWORD',
    MNEMONIC: 'MNEMONIC',
    IS_MNEMONIC_SAVED: 'IS_MNEMONIC_SAVED',
    FIRST_ACTION: 'FIRST_ACTION'
};

/**
 * Setting local device variable FIRST_ACTION with true
 * @returns {String}  
 */
export async function setFirstAction() {
    await AsyncStorage.setItem(storageConstants.FIRST_ACTION, 'true')
}

/**
 * Setting local device variable EMAIL with some value
 * @param {String} email value to set
 */
export async function setEmail(email) {
    await AsyncStorage.setItem(storageConstants.EMAIL, email);
}

/**
 * Setting local device variable PASSWORD with some value
 * @param {String} password value to set
 */
export async function setPassword(password) {
    await AsyncStorage.setItem(storageConstants.PASSWORD, password);
}

/**
 * Setting local device variable MNEMONIC with some value
 * @param {String} mnemonic value to set
 */
export async function setMnemonic(mnemonic) {
    await AsyncStorage.setItem(storageConstants.MNEMONIC, mnemonic);
}

/**
 * Setting local device variable IS_MNEMONIC_SAVED in false
 */
export async function setMnemonicNotSaved() {
    await AsyncStorage.setItem(storageConstants.IS_MNEMONIC_SAVED, 'false');
}

/**
 * Getting value from local device variable FIRST_ACTION
 * @returns {String}  
 */
export async function getFirstAction() {
    return await AsyncStorage.getItem(storageConstants.FIRST_ACTION)
}


/**
 * Getting value from local device variable EMAIL
 * @returns {String}  
 */
export async function getEmail() {
    return await AsyncStorage.getItem(storageConstants.EMAIL);
}

/**
 * Getting value from local device variable PASSWORD
 * @returns {String}  
 */
export async function getPassword() {
    return await AsyncStorage.getItem(storageConstants.PASSWORD);
}

/**
 * Getting value from local device variable MNEMONIC
 * @returns {String}  
 */
export async function getMnemonic() {
    return await AsyncStorage.getItem(storageConstants.MNEMONIC);
}

/**
 * Getting value from local device variable IS_MNEMONIC_SAVED
 * @returns {String}  
 */
export async function getMnemonicNotSaved() {
    return await AsyncStorage.getItem(storageConstants.IS_MNEMONIC_SAVED);
}

/**
 * Removing variable IS_MNEMONIC_SAVED from local device storage
 */
export async function removeMnemonicNotSaved() {
    await AsyncStorage.removeItem(storageConstants.IS_MNEMONIC_SAVED);
}
