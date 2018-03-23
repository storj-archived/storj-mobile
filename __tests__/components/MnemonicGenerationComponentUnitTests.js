import {
    TouchableOpacity,
    Text
} from 'react-native';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'; 
import sinon from 'sinon';
import MnemonicGenerationComponent from '../../src/components/Mnemonic/MnemonicGenerationComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('MnemonicGenerationComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('triggers actions correctly on TouchableOpacity press', () => {

        const redirectToMnemonicInfoScreenSpy = jest.fn();
        const redirectToLoginScreenSpy = jest.fn();
        const redirectToMnemonicConfirmationScreenSpy = jest.fn();

        const wrapper = shallow(
            <MnemonicGenerationComponent
                screenProps = { { 
                    redirectToMnemonicInfoScreen: redirectToMnemonicInfoScreenSpy,
                    redirectToLoginScreen: redirectToLoginScreenSpy,
                    redirectToMnemonicConfirmationScreen: redirectToMnemonicConfirmationScreenSpy
                } } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(redirectToMnemonicInfoScreenSpy.mock.calls.length).toBe(1);
        expect(redirectToLoginScreenSpy.mock.calls.length).toBe(1);
        expect(redirectToMnemonicConfirmationScreenSpy.mock.calls.length).toBe(1);
    });

    it('renders correctly with showCopyPopUp', () => {

		const wrapper = shallow(
			<MnemonicGenerationComponent />
        );

        wrapper.setState({ showCopyPopUp: true });
        
        expect(wrapper.find('TouchableOpacity').length).toBe(5);
        expect(wrapper.containsMatchingElement(<Text>Copied to clipboard</Text>)).toBe(true);
    });

});