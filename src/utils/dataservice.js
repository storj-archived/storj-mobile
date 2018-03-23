import { uuidv4, toQueryString, getFirstAndLastDayOfCurrentMonth } from '../utils/utils';
import { sha256 } from '../utils/sha256';
import StorjModule from '../utils/StorjModule';
import { DEBITS_URL, CREDITS_URL } from '../utils/constants/urlConstants';

export async function createGetDebitsRequest() {
    let params = {};
            
    let dates = getFirstAndLastDayOfCurrentMonth();

    params.startDate = dates.startDate;
    params.endDate = dates.endDate;    

    return await _getBillingRequest(DEBITS_URL, params);;
}

export async function createGetCreditsRequest() {
    let params = {};                            
    return await _getBillingRequest(CREDITS_URL, params);
}

async function _getBillingRequest(url, params) {
    let auth = await _getAuthorizationString();

    params.user = auth.email;
    params.__nonce = uuidv4();
    url += "?" + toQueryString(params);

    let request = new Request(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
          'Host': 'billing.prod.storj.io',
          'Authorization': auth.authString
        },
    });

    return request;
}

async function _getAuthorizationString() {
    let keysResponse = await StorjModule.getKeys("");
    let authString = "";

    if(!keysResponse.isSuccess) return authString;

    let keys = JSON.parse(keysResponse.result);

    let passwordHash = await sha256(keys.password);
            
    authString = 'Basic ' + btoa(keys.email + ":" + passwordHash);        

    return { email: keys.email, password: keys.password, authString };
}