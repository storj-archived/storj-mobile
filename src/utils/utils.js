/**
 * Sums the values of specified field in collection array [{}, {}]
 * @param {Array} arr - collection Array
 * @param {string} field - field in arr to sum up
 * @returns {Number}
 */
export function getSum(arr, field) {
    if (!arr || (Array.isArray(arr) && arr.length <= 0)) {
        return 0;
    }

    const sum = arr.reduce((acc, i) => {
        const add = typeof i[field] === 'undefined' ? 0 : i[field];
        return acc + add;
    }, 0);

    return sum;
};

/**
 * Prettifies the amount printed in billing history.
 * Returns either a string that lets the user know that the amount that
 * has been used is than 0.01 GB or rounds the amount to two decimal
 * places.
 * @param {Number} num - number in bytes or GB
 * @param {String} type - optional - undefined or 'bytes'
 */
export function roundToGBAmount(num, type) {
    const GB = 1000000000;

    const numInGB = type === 'bytes' ? num / GB : num;
    const modNum = setToTwoDecimalPlaces(numInGB);

    // Checks to see if the amount is less than one cent
    if (modNum.indexOf('0.00') === 0) {
        const lessThanOneCent = '< 0.01';
        return lessThanOneCent;
    }

    return modNum + '';
};

export function getFirstAndLastDayOfCurrentMonth() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
  
    let startDate = new Date(currentYear, currentMonth, 1);
    let endDate = new Date(currentYear, currentMonth + 1, 1);
  
    startDate.setUTCHours(0, 0, 0);
    endDate.setUTCHours(0, 0, 0);
  
    return {
      startDate,
      endDate
    };
};

/**
 * Rounds a number to two decimal places
 * @param {Number} num
 * @returns {String} num rounded and stringified to two decimal places
 */
export function setToTwoDecimalPlaces(num) {
    const roundedToTwoPlaces = Math.round(num * 100) / 100;
    const setToTwoPlaces = roundedToTwoPlaces.toFixed(2);

    return setToTwoPlaces;
};

/** 
 *Used for generation of pseudo UUIDV4 string 
*/
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

/**
 * Generates query string from obejct
 * @param {object} obj 
 */
export function toQueryString(obj) {
    var str = [];

    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }       

    return str.join("&");
}

/**
 * Formats from cents to dollars
 * @param {Number} amount - amount in cents (1000, 2000, 150)
 * @returns {String} prettified amount e.g. -$10.00, $12.00
 */
export const formatAmount = function (amount) {
    const newAmount = Math.round(amount) / 100;
  
    if (amount < 0) {
      return `-$${newAmount.toFixed(2).substr(1)}`;
    }
  
    return `$${(newAmount).toFixed(2)}`;
};

/**
 * Formats login credentials in login screen
 * @param {string} string 
 * @returns {string} formatted string 
 */
export function formatInput(string) {
    return string.trim().toLowerCase();
}

/**
 * [].includes() analog
 */
export function includes(array, item) {
    let arrayLength = array.length;

    for(let i = 0; i < arrayLength; i++) {
        if(array[i] === item) return true;
    }

    return false;
}