import { AsyncStorage } from 'react-native';

const storageConstants = {
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
 * Getting value from local device variable FIRST_ACTION
 * @returns {String}  
 */
export async function getFirstAction() {
    return await AsyncStorage.getItem(storageConstants.FIRST_ACTION)
}
