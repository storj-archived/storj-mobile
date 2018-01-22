import { NavigationActions } from 'react-navigation';
import authActions from '../../utils/constants/actionConstants';

const { LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, REGISTER, REGISTER_SUCCESS, REGISTER_ERROR } = authActions;

function loginSuccess() {
    return { type: LOGIN_SUCCESS };
};

function loginError() {
    return { type: LOGIN_ERROR };
};

function login( email, password, mnemonic, passCode) {
    return { type: LOGIN, payload: { email, password, mnemonic, passCode } };
};

function navigateToRegisterScreen() {
    return NavigationActions.navigate({ routeName: 'RegisterScreen' });
};

function register(email, password) {
    return { type: REGISTER, payload: {email, password} };
};

function registerSuccess(mnemonic) {
    return { type: REGISTER_SUCCESS, payload: { mnemonic }};
};

function registerError(error) {
    return { type: REGISTER_ERROR, error };
};

function returnToLoginScreen() {
    return NavigationActions.back();
};

function redirectToLoginScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'LoginScreen'})
        ]
    });
};

function redirectToMainScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'MainScreen'})
        ]
    });
};

function redirectToAuthFailureScreen(params) {
    return NavigationActions.navigate({ routeName: 'AuthFailureInfoScreen', params });
};

function redirectToRegisterSuccessScreen() {
    return NavigationActions.navigate({ routeName: 'RegisterSuccessInfoScreen' });
};

export const loginActionsCreators = {
    loginSuccess,
    loginError,
    login,
    navigateToRegisterScreen,
    redirectToAuthFailureScreen,
    redirectToMainScreen
};

export const registerActionsCreators = {
    registerSuccess,
    registerError,
    register,
    returnToLoginScreen,
    redirectToLoginScreen,
    redirectToAuthFailureScreen,
    redirectToRegisterSuccessScreen
}
