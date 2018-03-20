import { BILLING_CONSTANTS } from '../../utils/constants/actionConstants';

const { SET_CREDITS, SET_DEBITS, GET_DEBITS_FAILED } = BILLING_CONSTANTS;


const initialState = {
    credits: [],    
    wallets: {},
    defaultPaymentMethod: {},
    defaultPPId: '',
    billingDate: null,
    nextBillingPeriod: {},
    storage: "0.00",
    bandwidth: "0.00"
};


export default function billingReducer(state, action) {

    let newState = { };

    if(state) {
        newState = Object.assign({}, state);
    }

    switch(action.type) {
        case SET_CREDITS:
            break;
        case SET_DEBITS:            
            console.log(action);
            newState.storage = action.payload.debits.storage;
            newState.bandwidth = action.payload.debits.bandwidth;
            break;
        case GET_DEBITS_FAILED: //TODO: show error somehow
            break;
        default:
            return state || initialState;
    }

    return newState;
};

