import { BILLING_CONSTANTS } from '../../utils/constants/actionConstants';

const { SET_CREDITS, SET_DEBITS, GET_DEBITS_FAILED } = BILLING_CONSTANTS;


const initialState = {
    credits: [],    
    debits: [],
    // wallets: {},
    // defaultPaymentMethod: {},
    // defaultPPId: '',
    // billingDate: null,
    // nextBillingPeriod: {},
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
            newState.credits = action.payload.credits;
            break;
        case SET_DEBITS:            
            newState.debits = action.payload.debits;
            newState.storage = action.payload.usage.storage;
            newState.bandwidth = action.payload.usage.bandwidth;
            break;
        case GET_DEBITS_FAILED: //TODO: show error somehow
            break;
        default:
            return state || initialState;
    }

    return newState;
};

