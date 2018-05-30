import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import LoginContainer from '../../src/containers/LoginContainer';
import configureStore from 'redux-mock-store';
import { loginActionsCreators, registerActionsCreators } from '../../src/reducers/authentification/authActions';
import authReducer from '../../src/reducers/authentification/authReducer';
import { testUser } from 'jest-mock';
import sinon from 'sinon';
import { LoginStateModel } from '../../src/models/LoginStateModel';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();
const initialState = { authReducer : { user: { isLoggedIn: false, email: null, password: null }} };

describe('LoginContainer', ()=> {

	it('renders correctly', () => {

		const mockedStore = mockStore(initialState);
		const wrapper = shallow(
			<LoginContainer	
				screenProps = {{ redirectToMnemonicHelpScreen: () => {}}} />,
			{ context: { store: mockedStore } }
		);

		expect(wrapper.dive()).toMatchSnapshot();
	});

	it('triggers dispatch and login once on tryLogin method call', () => {
		const mockedStore = mockStore(initialState);
		const storeSpy = sinon.spy(mockedStore, 'dispatch');

		const wrapper = shallow(
			<LoginContainer 
				screenProps = {{ redirectToMnemonicHelpScreen: () => {}}} />,
			{ context: { store: mockedStore } }
		);

		const handle = wrapper.dive().instance();
		const loginSpy = sinon.spy(handle, 'login');

		handle.login();

		expect(storeSpy.called).toBe(true);
		expect(loginSpy.calledOnce).toBe(true);
	});    

	it('triggers setState on onChangeEmailInput', () => {
		const mockedStore = mockStore(initialState);
		const wrapper = shallow(
			<LoginContainer 
				screenProps = {{ redirectToMnemonicHelpScreen: () => {}}} />,
			{ context: { store: mockedStore } }
		);

		const handle = wrapper.dive().instance();
		const stateSpy = sinon.spy(handle, 'setState');

		handle.onChangeEmailInput(handle);

		expect(stateSpy.calledOnce).toBe(true);
	});    

	it('triggers setState on onChangePasswordInput', () => {
		const mockedStore = mockStore(initialState);
		const wrapper = shallow(
			<LoginContainer 
				screenProps = {{ redirectToMnemonicHelpScreen: () => {}}} />,
			{ context: { store: mockedStore } }
		);

		const handle = wrapper.dive().instance();
		const stateSpy = sinon.spy(handle, 'setState');

		handle.onChangePasswordInput();

		expect(stateSpy.calledOnce).toBe(true);
	});   

	it('triggers navigateToRegisterScreen on redirectToRegisterScreen', () => {
		const mockedStore = mockStore(initialState);
		const wrapper = shallow(
			<LoginContainer 
				screenProps = {{ redirectToMnemonicHelpScreen: () => {}}} />,
			{ context: { store: mockedStore } }
		);

		const handle = wrapper.dive().instance();
		const redirectSpy = sinon.spy(handle, 'redirectToRegisterScreen');

		handle.redirectToRegisterScreen();

		expect(redirectSpy.calledOnce).toBe(true);
	}); 

	it('triggers setState on ChangePassword', () => {
		const mockedStore = mockStore(initialState);
        const wrapper = shallow(
			<LoginContainer 
				screenProps = {{ redirectToMnemonicHelpScreen: () => {}}} />,
            { context: { store: mockedStore } }
        );
        const newPass = 'newPassword';
    
        const handle = wrapper.dive().instance();
        const prevState = handle.state;
        const newState = new LoginStateModel(prevState.email, newPass);

        handle.onChangePasswordInput(newPass);

        expect(newState.isEqualTo(handle.state.stateModel)).toBe(true);
        expect(handle.state.stateModel.password).toEqual(newPass);
    });  

    it('triggers setState on ChangeEmail', () => {
		const mockedStore = mockStore(initialState);
		
        const wrapper = shallow(
            <LoginContainer 
				screenProps = {{ redirectToMnemonicHelpScreen: () => {}}} />,
            { context: { store: mockedStore } }
        );

        const newEmail = 'new@gmail.com';
    
        const handle = wrapper.dive().instance();
        const prevState = handle.state;
        const newState = new LoginStateModel(newEmail, prevState.password);

        handle.onChangeEmailInput(newEmail);

        expect(newState.isEqualTo(handle.state.stateModel)).toBe(true);
        expect(handle.state.stateModel.email).toEqual(newEmail);
    });
});

