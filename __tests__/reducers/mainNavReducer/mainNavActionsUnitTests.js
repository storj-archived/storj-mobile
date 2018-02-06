import { loginActionsCreators, registerActionsCreators, qrScannerActionsCreators} from '../../../src/reducers/authentification/authActions';
import * as navigationActionsCreators from '../../../src/reducers/navigation/navigationActions'

describe('Navigation reducer tests', () => {
    
    it('redirect to registerScreen test from LoginScreen', () => {
        const routeName = 'RegisterScreen';
        const expected = { type: "Navigation/NAVIGATE", routeName: routeName };
        const result = loginActionsCreators.navigateToRegisterScreen();
    
        expect(result).toEqual(expected);
    });

    it('redirect to LoginScreen test from RegisterScreen', () => {
        const routeName = 'LoginScreen';
        const expected = {actions: [{ routeName: "LoginScreen", type: "Navigation/NAVIGATE"}], index: 0, key: undefined, type: "Navigation/RESET"}
        const result = registerActionsCreators.redirectToLoginScreen();
    
        expect(result).toEqual(expected);
    });

    it('redirect to MainScreen test from LoginScreen', () => {
        const routeName = 'MainScreen';
        const expected =  {actions: [{ routeName: "MainScreen", type: "Navigation/NAVIGATE"}], index: 0, key: undefined, type: "Navigation/RESET"}
        const result = loginActionsCreators.redirectToMainScreen();
    
        expect(result).toEqual(expected);
    });

    it('redirect to AuthFailureScreen test from LoginScreen', () => {
        const routeName = 'AuthFailureInfoScreen';
        const expected = { type: "Navigation/NAVIGATE", routeName: routeName };
        const result = loginActionsCreators.redirectToAuthFailureScreen();
    
        expect(result).toEqual(expected);
    });

    it('redirect to AuthFailureScreen test from RegisterScreen', () => {
        const routeName = 'AuthFailureInfoScreen';
        const expected = { type: "Navigation/NAVIGATE", routeName: routeName };
        const result = registerActionsCreators.redirectToAuthFailureScreen();
    
        expect(result).toEqual(expected);
    });

    it('redirect to RegisterSuccessScreen test from RegisterScreen', () => {
        const routeName = 'RegisterSuccessInfoScreen';
        const mnemonic = 'mnemonic'
        const expected = { type: "Navigation/NAVIGATE", routeName: routeName };
        const result = registerActionsCreators.redirectToRegisterSuccessScreen();
    
        expect(result).toEqual(expected);
    });

    it('redirect to LoginScreen test with navigationActions', () => {
        const routeName = 'RegisterSuccessInfoScreen';
        const expected = {actions: [{ routeName: "LoginScreen", type: "Navigation/NAVIGATE"}], index: 0, key: undefined, type: "Navigation/RESET"}
        const result = navigationActionsCreators.redirectToLoginScreen();
    
        expect(result).toEqual(expected);
    });

    it('redirect to MainScreen test with navigationActions', () => {
        const routeName = 'RegisterSuccessInfoScreen';
        const expected = {actions: [{ routeName: "MainScreen", type: "Navigation/NAVIGATE"}], index: 0, key: undefined, type: "Navigation/RESET"}
        const result = navigationActionsCreators.redirectToMainScreen();
    
        expect(result).toEqual(expected);
    });

    it('redirect to OnBoardingScreen with navigationActions ', () => {
        const routeName = 'RegisterSuccessInfoScreen';
        const expected = {actions: [{ routeName: "OnBoardingScreen", type: "Navigation/NAVIGATE"}], index: 0, key: undefined, type: "Navigation/RESET"}
        const result = navigationActionsCreators.redirectToOnBoardingScreen();
    
        expect(result).toEqual(expected);
    });
})
