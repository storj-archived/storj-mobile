import {
    View
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import MnemonicConfirmedComponent from '../../src/components/Mnemonic/MnemonicConfirmedComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('MnemonicConfirmedComponent', () => {    

	it('renders correctly', () => {

		const wrapper = shallow(
			<MnemonicConfirmedComponent />
        );
        
		expect(wrapper).toMatchSnapshot();
    });

    it('triggers actions correctly on TouchableOpacity press', () => {

        const redirectToLoginScreenSpy = jest.fn();

        const wrapper = shallow(
            <MnemonicConfirmedComponent
                screenProps = { { 
                    redirectToLoginScreen: redirectToLoginScreenSpy
                } } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(redirectToLoginScreenSpy.mock.calls.length).toBe(1);
    });
    
});
