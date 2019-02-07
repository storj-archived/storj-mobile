import authActions from '../../../src/utils/constants/actionConstants';
import { loginActionsCreators, registerActionsCreators } from '../../../src/reducers/authentification/authActions';


const { LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, REGISTER, REGISTER_SUCCESS, REGISTER_ERROR } = authActions;


describe('Testing authentification actionCreators', () => {
it('login actionCreator test', () => {
    const email = "test@gmail.com";
    const password = '1234567';
    const mnemonic = 'mnemonic';
    const expected = { type: LOGIN, payload: { email, password, mnemonic} };
    const result = loginActionsCreators.login(email, password, mnemonic);

    expect(result).toEqual(expected);
});

it('loginSuccess actionCreator test', () => {
    const expected = { type: LOGIN_SUCCESS };
    const result = loginActionsCreators.loginSuccess();

    expect(result).toEqual(expected);
});

it('loginError actionCreator test', () => {
    const expected = { type: LOGIN_ERROR };
    const result = loginActionsCreators.loginError();

    expect(result).toEqual(expected);
});

it('register actionCreator test', () => {
    const payload = { email: "test@gmail.com", password: '1234567' };
    const expected = { type: REGISTER, payload };
    const result = registerActionsCreators.register(payload.email, payload.password, payload.mnemonic);

    expect(result).toEqual(expected);
});

it('registerSuccess actionCreator test', () => {
    const expected = { type: REGISTER_SUCCESS, payload: { mnemonic: undefined } };
    const result = registerActionsCreators.registerSuccess();
    
    expect(result).toEqual(expected);
});

it('registerError actionCreator test', () => {
    const error = "Error message";
    const expected = { type: REGISTER_ERROR, error };
    const result = registerActionsCreators.registerError(error);

    expect(result).toEqual(expected);
});
});