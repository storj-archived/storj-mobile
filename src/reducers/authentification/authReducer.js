import loginActions from '../../utils/constants/actionConstants';

const { LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, 
    REGISTER, REGISTER_SUCCESS, REGISTER_ERROR, 
    SET_EMAIL_NOT_CONFIRMED, SET_EMAIL_CONFIRMED,
    SET_ACCOUNT_NOT_EXIST, SET_ACCOUNT_EXIST, CLEAR,
    SAVE_MNEMONIC } = loginActions;

const initialState = {
    user: {  
        isLoggedIn: false, 
        email: null, 
        password: null, 
        mnemonic: null,
        error: null, 
        isLoading: false, 
        isRedirectedFromRegister: false,
        isEmailConfirmed: true,
        isAccountExist: true
    } 
};


export default function authReducer(state, action) {

    let newState = { user: {} };
    if(state && state.user) {
        newState.user = Object.assign({}, state.user);
    }

    //TODO: we can call return after switch, and reduce lines of code
    switch(action.type) {
        case LOGIN_SUCCESS:
            newState.user.isLoggedIn = true;

            return newState;

        case LOGIN_ERROR: 
            //TODO: should be removed. 
            //Logout action will set isLoggedIn ==> false. 
            //So here we just setting false into false. Redundant
            newState.user.isLoggedIn = false;

            return newState;

        case LOGIN:
            newState.user.email = action.payload.email;
            newState.user.password = action.payload.password;
            newState.user.mnemonic = action.payload.mnemonic;

            return newState;
        
        case REGISTER:
            newState.user.isLoading = true;
            newState.user.email = action.payload.email;
            newState.user.password = action.payload.password;
            
            return newState;

        case REGISTER_SUCCESS:
            newState.user.mnemonic = action.payload.mnemonic;
            newState.user.isLoading = false;
            newState.user.isRedirectedFromRegister = true;

            return newState;

        case REGISTER_ERROR:
            newState.user.error = action.error;
            newState.user.email = null;
            newState.user.password = null;
            newState.user.mnemonic = null;
            newState.user.IsRedirectedFromRegister = false;

            return newState;

        case SET_EMAIL_NOT_CONFIRMED:
            newState.user.isEmailConfirmed = false;

            return newState;

        case SET_EMAIL_CONFIRMED:
            newState.user.isEmailConfirmed = true;

            return newState;

        case SET_ACCOUNT_NOT_EXIST:
            newState.user.isAccountExist = false;

            return newState;

        case SET_ACCOUNT_EXIST:
            newState.user.isAccountExist = true;

            return newState;
        case SAVE_MNEMONIC: 
            newState.user.mnemonic = action.mnemonic;

            return newState;
        default:
            return state || initialState;
    }
};