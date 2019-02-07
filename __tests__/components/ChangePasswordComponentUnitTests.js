import {
    TouchableOpacity} from 'react-native';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme';
import ChangePasswordComponent from '../../src/components/MyAccount/Settings/ChangePasswordComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('ChangePasswordComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <ChangePasswordComponent
                screenProps = {{ redirectToSettingsScreen: () => {} }} />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly on error', () => {

        const wrapper = shallow(
            <ChangePasswordComponent
                screenProps = {{ redirectToSettingsScreen: () => {} }} />
        );

        wrapper.setState({ isError: true });

        expect(wrapper).toMatchSnapshot();
    });

    it('triggers functions correctly on submit', () => {
        const resetPasswordSpy = jest.fn();

        const wrapper = shallow(
            <ChangePasswordComponent 
                screenProps = {{
                    resetPassword: resetPasswordSpy
                }}/>
        );

        wrapper.setState({ email: "testemail@gmail.com" });

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(resetPasswordSpy.mock.calls.length).toBe(1);
    });
});