import {
    TouchableOpacity
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RegisterSuccessComponent from '../../src/components/Registration/RegisterSuccessComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('RegisterSuccessComponent', () => {

    it('renders correctly', () => {
        const wrapper = shallow(
            <RegisterSuccessComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('trigger actions on press correctly', () => {
        const redirectToMnemonicInfoScreenSpy = jest.fn();

        const wrapper = shallow(
            <RegisterSuccessComponent
                screenProps = { { redirectToMnemonicInfoScreen: redirectToMnemonicInfoScreenSpy } } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(redirectToMnemonicInfoScreenSpy.mock.calls.length).toBe(1);
    });
});