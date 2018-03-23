import {
    View
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import MnemonicNotConfirmedComponent from '../../src/components/Mnemonic/MnemonicNotConfirmedComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('MnemonicNotConfirmedComponent', () => {    

	it('renders correctly', () => {

		const wrapper = shallow(
			<MnemonicNotConfirmedComponent />
        );
        
		expect(wrapper).toMatchSnapshot();
    });

    it('triggers actions correctly on TouchableOpacity press', () => {

        const redirectToLoginScreenSpy = jest.fn();
        const navigateBackSpy = jest.fn();
        const setNewDataSpy = jest.fn();

        const wrapper = shallow(
            <MnemonicNotConfirmedComponent
                navigation = { { state: { params: { setNewData: setNewDataSpy } } } }
                screenProps = { { 
                    redirectToLoginScreen: redirectToLoginScreenSpy,
                    navigateBack: navigateBackSpy
                } } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(redirectToLoginScreenSpy.mock.calls.length).toBe(1);
        expect(navigateBackSpy.mock.calls.length).toBe(1);
        expect(setNewDataSpy.mock.calls.length).toBe(1);
    });
    
});
