import {
    View
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import MnemonicConfirmationComponent from '../../src/components/Mnemonic/MnemonicConfirmationComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('MnemonicConfirmationComponent', () => {    

	it('renders correctly', () => {

		const wrapper = shallow(
			<MnemonicConfirmationComponent 
                navigation = { { state:{ params: { mnemonic: '' } } } }/>
        );
        
		expect(wrapper).toMatchSnapshot();
    });

    it('triggers actions correctly on TouchableOpacity press', () => {

        const redirectToMnemonicGenerationScreenSpy = jest.fn();
        const redirectToLoginScreenSpy = jest.fn();

        const wrapper = shallow(
            <MnemonicConfirmationComponent
                navigation = { { state: { params: { mnemonic: '' } } } }
                screenProps = { { 
                    redirectToMnemonicGenerationScreen: redirectToMnemonicGenerationScreenSpy,
                    redirectToLoginScreen: redirectToLoginScreenSpy
                } } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(redirectToMnemonicGenerationScreenSpy.mock.calls.length).toBe(1);
        expect(redirectToLoginScreenSpy.mock.calls.length).toBe(1);
    });

    it('renders correctly with showFirstSet', () => {

		const wrapper = shallow(
			<MnemonicConfirmationComponent 
                navigation = { { state:{ params: { mnemonic: '' } } } }/>
        );

        wrapper.setState({ showFirstSet: true });
        
		expect(wrapper.find('TouchableOpacity').length).toBe(8);
    });

    it('renders correctly with showSecondSet', () => {

		const wrapper = shallow(
			<MnemonicConfirmationComponent 
                navigation = { { state:{ params: { mnemonic: '' } } } }/>
        );

        wrapper.setState({ showSecondSet: true });
        
		expect(wrapper.find('TouchableOpacity').length).toBe(8);
    });
    
});
