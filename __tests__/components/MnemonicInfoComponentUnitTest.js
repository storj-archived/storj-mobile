import {
    TouchableOpacity,
    Alert} from 'react-native';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme';
import MnemonicInfoComponent from '../../src/components/Mnemonic/MnemonicInfoComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('MnemonicInfoComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <MnemonicInfoComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('triggers actions correctly on TouchableOpacity press', () => {

        const redirectToRegisterSuccessScreenSpy = jest.fn();
        const redirectToMnemonicGenerationScreenSpy = jest.fn();

        const wrapper = shallow(
            <MnemonicInfoComponent
                screenProps = { { 
                    redirectToRegisterSuccessScreen: redirectToRegisterSuccessScreenSpy,
                    redirectToMnemonicGenerationScreen: redirectToMnemonicGenerationScreenSpy
                } } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(redirectToRegisterSuccessScreenSpy.mock.calls.length).toBe(1);
        expect(redirectToMnemonicGenerationScreenSpy.mock.calls.length).toBe(1);
    });


    it('renders correctly with showEmailAlert', () => {

		const wrapper = shallow(
			<MnemonicInfoComponent />
        );

        wrapper.setState({ showEmailAlert: true });
        
        expect(wrapper.containsMatchingElement(Alert)).toBe(true);
    });

    it('renders correctly with showBackupAlert', () => {

		const wrapper = shallow(
			<MnemonicInfoComponent />
        );

        wrapper.setState({ showBackupAlert: true });
        
        expect(wrapper.containsMatchingElement(Alert)).toBe(true);
    });

});