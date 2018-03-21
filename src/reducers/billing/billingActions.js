import { BILLING_CONSTANTS } from '../../utils/constants/actionConstants';
import StorjModule from '../../utils/StorjModule';
import { getSum, roundToGBAmount } from '../../utils/utils';
import { createGetDebitsRequest, createGetCreditsRequest } from '../../utils/dataservice';

const { SET_CREDITS, SET_DEBITS, GET_DEBITS_FAILED } = BILLING_CONSTANTS;

export function getDebits () {
    return async (dispatch) => {                
        let request = await createGetDebitsRequest();
        let response = await fetch(request);

        if(response.status === 200) {
            let debits = await response.json();
            let usage = _getUsage(debits);                         
            dispatch(setDebits(debits, usage));
        } else {                
            dispatch({ type: GET_DEBITS_FAILED });
        }        
    };
}

export function getCredits () {
    return async (dispatch) => {                            
        let request = await createGetCreditsRequest();
        let response = await fetch(request);

        if(response.status === 200) {
            let credits = await response.json();                                
            dispatch(setCredits(credits));
        } else {                
            dispatch({ type: GET_DEBITS_FAILED });
        }        
    };
}

function setDebits(debits, usage) {
    return { type: SET_DEBITS, payload: { debits, usage } };
}

function setCredits(credits) {
    return { type: SET_CREDITS, payload: { credits } };
}

function _getUsage(debits) {
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