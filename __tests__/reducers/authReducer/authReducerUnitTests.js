import authReducer from '../../../src/reducers/authentification/authReducer';
import authActions from '../../../src/utils/constants/actionConstants';

const { LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, REGISTER, REGISTER_SUCCESS, REGISTER_ERROR } = authActions;

describe('Authentification reducer tests', () => {

    it('login state validity test', () => {
        let state = { 
            user: { 
                isLoggedIn: false, 
                email: null, 
                password: null 
            } 
        };

        const action = { type: LOGIN, payload: { email: "test@gmail.com", password: "1234567", mnemonic: 'mnemonic', passCode: 'passCode' } };
        const expected = { 
            user: {  
                isLoggedIn: false, 
                email: "test@gmail.com", 
                password: "1234567", 
                mnemonic: 'mnemonic', 
                passCode: 'passCode'
            } 
        };
        
        const result = authReducer(state, action);

        expect(result).toEqual(expected);
    });

    /**
     * login action test to see if reducer returns a new object
     */
    it('login state immutability test', () => {
        let state = { user: { isLoggedIn: false, email: null, password: null, mnemonic: null, passCode: null,
                                IsRedirectedFromRegister: false, error: null, isLoading: false } };

        const action = { type: LOGIN, payload: { email: "test@gmail.com", password: "1234567", mnemonic: 'mnemonic', passCode: 'passCode' } };
        const result = authReducer(state, action);

        expect(result).not.toBe(state);
    })

    /**
     * loginSuccess action test to see if reducer returns valid state
     */
    it('loginSuccess state validity test', () => {
        let state = { 
            user: { 
                isLoggedIn: false, 
                email: "test@gmail.com", 
                password: "1234567", 
                mnemonic: 'mnemonic', 
                passCode: 'passCode' 
            } 
        };

        const action = { type: LOGIN_SUCCESS };
        const result = authReducer(state, action);
        const expected = { 
            user: { 
                isLoggedIn: true, 
                email: "test@gmail.com", 
                password: "1234567",
                mnemonic: 'mnemonic', 
                passCode: 'passCode'
            } 
        };

        expect(result).toEqual(expected);
    });

    /**
     * registerSuccess action test to see if reducer returns a new object
     */
    it('loginSuccess state immutability test', () => {
        let state = { user: { isLoggedIn: false, email: "test@gmail.com", password: "1234567", mnemonic: 'mnemonic', passCode: 'passCode',
                                 error: null, isLoading: false, IsRedirectedFromRegister: false } };

        const action = { type: LOGIN_SUCCESS };
        const result = authReducer(state, action);

        expect(result).not.toBe(state);
    })

    /**
     * registerError action test to see if reducer returns valid state
     */
    it('loginError state validity test', () => {
        let state = { 
            user: { 
                isLoggedIn: false, 
                email: "test@gmail.com", 
                password: "1234567", 
                mnemonic: 'mnemonic', 
                passCode: 'passCode' 
            } 
        };

        const action = { type: LOGIN_ERROR };
        const result = authReducer(state, action);
        const expected = { 
            user: {  
                isLoggedIn: false, 
                email: 'test@gmail.com', 
                password: '1234567',
                mnemonic: 'mnemonic', 
                passCode: 'passCode', 
            } 
        };

        expect(result).toEqual(expected);
    });

    /**
     * loginError action test to see if reducer returns a new object
     */
    it('loginError state immutability test', () => {
        let state = { user: { isLoggedIn: false, email: "test@gmail.com", password: "1234567", mnemonic: 'mnemonic', passCode: 'passCode',
                                error: null, isLoading: false, IsRedirectedFromRegister: false } };

        const action = { type: LOGIN_ERROR };
        const result = authReducer(state, action);

        expect(result).not.toBe(state);
    });

    it('register state validity test', () => {
        let state = { 
            user: {
                email: null, 
                password: null, 
                passCode: null, 
                mnemonic: null, 
                error: null, 
                isLoading: false, 
                isLoggedIn: false
            } 
        };

        const action = { type: REGISTER, payload: { 
            email: "test@gmail.com", 
            password: "1234567"
        }};

        const expected = { user: { 
            email: "test@gmail.com", 
            password: "1234567", 
            mnemonic: null, 
            passCode: null,
            error: null, 
            isLoading: true, 
            isLoggedIn: false
        }};

        const result = authReducer(state, action); 

        expect(result).toEqual(expected);
    });

    /**
     * register action test to see if reducer returns a new object
     */
    it('register state immutability test', () => {
        let state = { user: {email: null, password: null, passCode: null, mnemonic: null,  error: null, 
                                isLoading: false, isLoggedIn: false, IsRedirectedFromRegister: false } };

        const action = { type: REGISTER, payload: { email: "test@gmail.com", password: "1234567", mnemonic: "test mnemonic" } };
        const result = authReducer(state, action);

        expect(result).not.toBe(state);
    })

    /**
     * registerSuccess action test to see if reducer returns valid state
     */
    it('registerSuccess state validity test', () => {
        let state = { 
            user: {
                email: "test@gmail.com", 
                password: "1234567",
                mnemonic: "test mnemonic", 
                passCode: null,  
                error: null, 
                isLoading: false, 
                isLoggedIn: false,
                isRedirectedFromRegister: false
            } 
        };

        const action = { type: REGISTER_SUCCESS, payload: { mnemonic: "test mnemonic"} };
        const result = authReducer(state, action);
        const expected  = { 
            user: {
                email: "test@gmail.com", 
                password: "1234567",
                mnemonic: "test mnemonic", 
                passCode: null,  
                error: null, 
                isLoading: false, 
                isLoggedIn: false,
                isRedirectedFromRegister: true
            } 
        };
                                    
        expect(result).toEqual(expected);
    });

    /**
     * registerSuccess action test to see if reducer returns a new object
     */
    it('registerSuccess state immutability test', () => {
        let state = { user: { email: "test@gmail.com", password: "1234567",mnemonic: "test mnemonic", passCode: null,
                                error: null, isLoading: true, isLoggedIn: false, IsRedirectedFromRegister: true } };

        const action = { type: REGISTER_SUCCESS, payload: { mnemonic: "test mnemonic"} };
        const result = authReducer(state, action);

        expect(result).not.toBe(state);
    })

    /**
     * registerError action test to see if reducer returns valid state
     */
    it('registerError state validity test', () => {
        let state = { user: { email: "test@gmail.com", password: "1234567", mnemonic: "test mnemonic", passCode: null,
                                error: null, isLoading: true, isLoggedIn: false, IsRedirectedFromRegister: false } };

        const error = "Test error";
        const action = { type: REGISTER_ERROR, error };
        const result = authReducer(state, action);
        const expected = { user: { email: null, password: null, passCode: null, mnemonic: null,
                                    error: "Test error", isLoading: true, isLoggedIn: false, IsRedirectedFromRegister: false } };

        expect(result).toEqual(expected);
    });

    /**
     * registerError action test to see if reducer returns a new object
     */
    it('registerError state immutability test', () => {
        let state = { user: { email: "test@gmail.com", password: "1234567", mnemonic: "test mnemonic", passCode: null,
                                error: null, isLoading: true, isLoggedIn: false, IsRedirectedFromRegister: false } };

        const error = "Test error";
        const action = { type: REGISTER_ERROR, error };
        const result = authReducer(state, action);

        expect(result).not.toBe(state);
    });
});