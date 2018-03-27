import { BILLING_CONSTANTS } from '../../utils/constants/actionConstants';
import StorjModule from '../../utils/StorjModule';
import { getSum, roundToGBAmount } from '../../utils/utils';
import { getDebitsRequest, getCreditsRequest, createWalletRequest, getWalletRequest } from '../../utils/dataservice';

const { SET_CREDITS, SET_DEBITS, SET_WALLETS, CREATE_WALLET, GET_DEBITS_FAILED } = BILLING_CONSTANTS;

export function getDebits() {
    return async (dispatch) => {                
        let request = await getDebitsRequest();
        let response = await fetch(request);

        if(response.ok) {
            let debits = await response.json();
            let usage = _getUsage(debits);                         
            dispatch(setDebits(debits, usage));
        } else {                
            dispatch({ type: GET_DEBITS_FAILED });
        }        
    };
}

export function getCredits() {
    return async (dispatch) => {                            
        let request = await getCreditsRequest();
        let response = await fetch(request);

        if(response.ok) {
            let credits = await response.json();                                
            dispatch(setCredits(credits));
        } else {                
            dispatch({ type: GET_DEBITS_FAILED });
        }        
    };
}

export function createWallet(currency) {
    return async (dispatch) => {                            
        let request = await createWalletRequest(currency);        
        let response = await fetch(request);

        if(response.ok) {
            let wallet = await response.json();                               
            dispatch({ type: CREATE_WALLET, payload: { wallet } });
        } else {                
            dispatch({ type: GET_DEBITS_FAILED });
        }        
    };
}

export function getWallets() {
    return async (dispatch) => {                            
        let request = await getWalletRequest();
        let response = await fetch(request);

        if(response.ok) {
            let wallets = await response.json();                                
            dispatch({ type: SET_WALLETS, payload: { wallets } });
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