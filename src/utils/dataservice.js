import { uuidv4, toQueryString, getFirstAndLastDayOfCurrentMonth } from '../utils/utils';
import { sha256 } from '../utils/sha256';
import StorjModule from '../utils/StorjModule';
import { DEBITS_URL, CREDITS_URL, WALLETS_URL } from '../utils/constants/urlConstants';

export async function getDebitsRequest() {
    let params = {};
            
    let dates = getFirstAndLastDayOfCurrentMonth();

    params.startDate = dates.startDate;
    params.endDate = dates.endDate;    

    return await _getBillingRequest(DEBITS_URL, params);;
}

export async function getCreditsRequest() {
    let params = {};                            
    return await _getBillingRequest(CREDITS_URL, params);
}

export async function createWalletRequest(currency) {
    let params = {};
    params.currency = currency;

    return await _postWalletRequest(WALLETS_URL, params);    
}

export async function getWalletRequest() {
    let params = {};                            
    
    return await _getBillingRequest(WALLETS_URL, params);              
}

async function _postWalletRequest(url, params) {
    let auth = await _getAuthorizationString();

    params.user = auth.email;
    params.__nonce = uuidv4();

    let request = _createRequest(url, 'POST', auth.authString, params);

    return request;
}

async function _getBillingRequest(url, params) {
    let auth = await _getAuthorizationString();

    params.user = auth.email;
    params.__nonce = uuidv4();
    url += "?" + toQueryString(params);

    let request = _createRequest(url, 'GET', auth.authString)

    return request;
}

function _createRequest(url, methodType, auth, data) {
    let params = {
        method: methodType,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
          'Host': 'billing.prod.storj.io',
          'Authorization': auth
        },
    };

    if(methodType === 'POST') {
        params.body = JSON.stringify(data);
    }
    return new Request(url, params);
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