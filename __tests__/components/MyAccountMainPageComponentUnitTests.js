import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MyAccountMainPageComponent from '../../src/components/MyAccount/MyAccountMainPageComponent';
import OptionsComponent from '../../src/components/MyAccount/OptionsComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('MyAccountMainPageComponent', () => {    

	it('renders correctly', () => {

		const wrapper = shallow(
            <MyAccountMainPageComponent
                screenProps = { { 
                    showQR: () => {},
                    redirectToStorageScreen: () => {},
                    redirectToBalanceScreen: () => {},
                    redirectToSettingsScreen: () => {},
                    clearAuthReducer: () => {},
                    redirectToInitializationScreen: () => {},
                    getBalance: () => {return '0'}
                } } />
        );
        
		expect(wrapper).toMatchSnapshot();
    });

    it('triggers actions correctly on TouchableOpacity press', () => {

        const showQRSpy = jest.fn();
        const redirectToStorageScreenSpy = jest.fn();
        const redirectToBalanceScreenSpy = jest.fn();
        const redirectToSettingsScreenSpy = jest.fn();

        const wrapper = shallow(
            <MyAccountMainPageComponent
                screenProps = { { 
                    showQR: showQRSpy,
                    redirectToStorageScreen: redirectToStorageScreenSpy,
                    redirectToBalanceScreen: redirectToBalanceScreenSpy,
                    redirectToSettingsScreen: redirectToSettingsScreenSpy,
                    getBalance: () => {return 1}
                } } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });
        
        wrapper.find('OptionsComponent').forEach(child => {
            child.simulate('Press');
        });

        expect(showQRSpy.mock.calls.length).toBe(1);
        expect(redirectToStorageScreenSpy.mock.calls.length).toBe(0);
        expect(redirectToBalanceScreenSpy.mock.calls.length).toBe(1);
        expect(redirectToSettingsScreenSpy.mock.calls.length).toBe(1);
    });
    
});
