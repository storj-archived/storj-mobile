import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Checkbox from '../../src/components/Common/CheckboxComponent'
import RegisterComponent from '../../src/components/Registration/RegisterComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('RegisterComponent', () => {
    it('renders correctly', () => {
        const wrapper = shallow(
            <RegisterComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('triggers submitButton press correctly on button press', () => {
        const buttonSpy = jest.fn();

        const wrapper = shallow(
            <RegisterComponent 
                onSubmit = { buttonSpy } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('PressOut');
        });

        expect(buttonSpy.mock.calls.length).toBe(1);
    });

    it('triggers inputs change text correctly', () => {
        const emailSpy = jest.fn();
        const passwordSpy = jest.fn();
        const repeatPasswordSpy = jest.fn();

        const wrapper = shallow(
            <RegisterComponent 
                onChangeEmail = { emailSpy }
                onChangePassword = { passwordSpy }
                onChangePasswordRepeat = { repeatPasswordSpy }/>
        );

        wrapper.find('InputComponent').forEach(child => {
            child.simulate('ChangeText');
        });

        expect(emailSpy.mock.calls.length).toBe(1);
        expect(passwordSpy.mock.calls.length).toBe(1);
        expect(repeatPasswordSpy.mock.calls.length).toBe(1);
    });

    it('triggers changeTermsAccepted on checkbox press', () => {
        const changeTermsAcceptedSpy = jest.fn();

        const wrapper = shallow(
            <RegisterComponent 
                onChangeTermsAcceptence = { changeTermsAcceptedSpy } />
        );

        wrapper.find(Checkbox).forEach(child => {
            child.simulate('Press');
        });

        expect(changeTermsAcceptedSpy.mock.calls.length).toBe(1);
    });
});