import { BILLING_CONSTANTS } from '../../utils/constants/actionConstants';
import { DEBITS_URL } from '../../utils/constants/urlConstants';
import StorjModule from '../../utils/StorjModule';
import { sha256 } from '../../utils/sha256';
import { getSum, roundToGBAmount, uuidv4, toQueryString, getFirstAndLastDayOfCurrentMonth } from '../../utils/utils';

const { SET_CREDITS, SET_DEBITS, GET_DEBITS_FAILED } = BILLING_CONSTANTS;

function getCredits () {
    return { type: SET_CREDITS };
}

export function getDebits (email, password) {
    return async (dispatch) => {
        sha256(password).then(async hash => {
            
            let authorization = 'Basic ' + btoa(email + ":" + hash);            
            let request = _createGetDebitsRequest(email, authorization);
            let response = await fetch(request);

            if(response.status === 200) {
                let debits = _getDebits(await response.json());                         
                dispatch(setDebits(debits));
            } else {                
                dispatch({ type: GET_DEBITS_FAILED });
            }
        });
    };
}

function setDebits(debits) {
    return { type: SET_DEBITS, payload: { debits } };
}


function _getDebits(debits) {
    let avgHoursPerMonth = 730;
    if (debits.length <= 0) {
        return;
    }

    let stor = getSum(debits, 'storage');
    let currentStor = stor / avgHoursPerMonth;
    let roundStor = roundToGBAmount(currentStor);

    let band = getSum(debits, 'bandwidth');
    let roundBandwidth = roundToGBAmount(band, 'bytes');

    return {storage: roundStor, bandwidth: roundBandwidth};        
}

function _createGetDebitsRequest(email, authorization) {
    let params = {};
            
    let dates = getFirstAndLastDayOfCurrentMonth();

    params.user = email;
    params.startDate = dates.startDate;
    params.endDate = dates.endDate;
    params.__nonce = uuidv4();

    var url = DEBITS_URL + "?" + toQueryString(params);
    
    let request = new Request(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
          'Host': 'billing.prod.storj.io',
          'Authorization': authorization
        },
    });

    return request;
}