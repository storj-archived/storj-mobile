import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store';
import Enzyme, { shallow } from 'enzyme'; 
import LoginComponent from '../../src/components/Login/LoginComponent';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();
const initialState = { loginReducer : {user: { isLoggedIn: false, email: null, password: null }} };

describe('LoginComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <LoginComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('triggers Login press correctly', () => {
        const buttonSpy = jest.fn();

        const wrapper = shallow(
            <LoginComponent
                onSubmit = { buttonSpy } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('PressOut');
        });

        expect(buttonSpy.mock.calls.length).toBe(1);
    });

    it('inputs text change triggers correctly', () => {
        const emailSpy = jest.fn();
        const passwordSpy = jest.fn();
        const mnemonicSpy = jest.fn();
        const passCodeSpy = jest.fn();

        const wrapper = shallow(
            <LoginComponent 
                onChangeLogin = { emailSpy } 
                onChangePassword = { passwordSpy }
                onChangeMnemonic = { mnemonicSpy } />
        );

        wrapper.find('InputComponent').forEach(child => {
            child.simulate('ChangeText');
        });

        expect(emailSpy.mock.calls.length).toBe(1);
        expect(passwordSpy.mock.calls.length).toBe(1);
        expect(mnemonicSpy.mock.calls.length).toBe(1);
    });
});