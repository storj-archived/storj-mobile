import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import RegisterContainer from '../../src/containers/RegisterContainer';
import StorjModule from '../../src/utils/storjModule';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();
const initialState = { authReducer: { email: null, password: null, isSuccess: false, error: null, isLoading: false } };
const store = mockStore(initialState);

jest.mock('../../src/utils/StorjModule', () => {
    return {
        register: jest.fn((email, password) => {
            if(email === 'example@email.com' && password === '12345') {
                return {
                    isSuccess: true,
                    mnemonic: 'mnemonic',
                    errorMessage: null
                };
            } 
        })
    };
});

describe('RegisterContainer', ()=> {
    const numOfRegisterInvokes = 2;
    
    it('renders correctly', () => {

        const wrapper = shallow(
            <RegisterContainer />,
            { context: { store: store } }
        );

        expect(wrapper.dive()).toMatchSnapshot();
    });    

    it('onSubmit valid', async () => {
        const email = 'example@email.com';
        const password = '12345';
        const passwordRepeat = '12345';
        const areTermsAccepted = true;

        const wrapper = shallow(
            <RegisterContainer />,
            { context: { store: store } }
        );

        const handle = wrapper.dive().instance();
        handle.setState({ stateModel: { email, password, passwordRepeat, areTermsAccepted }});
        
        await handle.onSubmit();
        
        expect(StorjModule.register.mock.calls[0][0]).toBe(email);
        expect(StorjModule.register.mock.calls[0][1]).toBe(password);
        expect(StorjModule.register).lastCalledWith(email, password, StorjModule.register.mock.calls[0][2]);
    });

    it('trigers handleFirstLaunch on successful registration', async () => {
        const email = 'example@email.com';
        const password = '12345';
        const passwordRepeat = '12345';
        const areTermsAccepted = true;

        const wrapper = shallow(
            <RegisterContainer />,
            { context: { store: store } }
        );

        const handle = wrapper.dive().instance();
        handle.setState({stateModel: { email, password, passwordRepeat, areTermsAccepted }});

        const handleFirstLaunchSpy = sinon.spy(handle, 'handleFirstLaunch');
        
        await handle.onSubmit();

        expect(handleFirstLaunchSpy.calledOnce).toBe(true);
    });    

    it('onSubmit no password', async () => {
        const email = 'example@email.com';
        const password = null;
        const passwordRepeat = '12345';
        const areTermsAccepted = true;

        const wrapper = shallow(
            <RegisterContainer />,
            { context: { store: store } }
        );

        const handle = wrapper.dive().instance();
        handle.setState({stateModel: { email, password, passwordRepeat, areTermsAccepted }});
        
        await handle.onSubmit();
        
        expect(StorjModule.register.mock.calls.length).toBe(numOfRegisterInvokes);
        expect(handle.state.errorModel.isPasswordError).toBe(true);
    });

    it('onSubmit passwords dont match', async () => {
        const email = 'example@email.com';
        const password = '12345';
        const passwordRepeat = '1234';
        const areTermsAccepted = true;

        const wrapper = shallow(
            <RegisterContainer />,
            { context: { store: store } }
        );

        const handle = wrapper.dive().instance();
        handle.setState({stateModel: { email, password, passwordRepeat, areTermsAccepted }});
        
        await handle.onSubmit();
        
        expect(StorjModule.register.mock.calls.length).toBe(numOfRegisterInvokes);
        expect(handle.state.errorModel.isPasswordMatchError).toBe(true);
    });

    it('onSubmit terms are not accepted', async () => {
        const email = 'example@email.com';
        const password = '12345';
        const passwordRepeat = '12345';
        const areTermsAccepted = false;

        const wrapper = shallow(
            <RegisterContainer />,
            { context: { store: store } }
        );

        const handle = wrapper.dive().instance();
        handle.setState({stateModel: { email, password, passwordRepeat, areTermsAccepted }});
        
        await handle.onSubmit();
        
        expect(StorjModule.register.mock.calls.length).toBe(numOfRegisterInvokes);
        expect(handle.state.errorModel.isTermsAcceptedError).toBe(true);
    });

    it('onSubmit invalid email', async () => {
        const email = 'notValid email@.com';
        const password = '12345';
        const passwordRepeat = '12345';
        const areTermsAccepted = false;

        const wrapper = shallow(
            <RegisterContainer />,
            { context: { store: store } }
        );

        const handle = wrapper.dive().instance();
        handle.setState({stateModel: { email, password, passwordRepeat, areTermsAccepted }});
        
        await handle.onSubmit();
        
        expect(StorjModule.register.mock.calls.length).toBe(numOfRegisterInvokes);
        expect(handle.state.errorModel.isEmailError).toBe(true);
    });
});
