import {
    TouchableOpacity} from 'react-native';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme';
import AddCreditComponent from '../../src/components/MyAccount/Balance/AddCreditComponent';

Enzyme.configure({ adapter: new Adapter() });
jest.unmock('ScrollView');

describe('AddCreditComponent', () => {

    it('renders correctly with wallets', () => {

        const wrapper = shallow(
            <AddCreditComponent
                wallets = {[{ address: 'address', token: 'token' }]} />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with no wallets', () => {

        const wrapper = shallow(
            <AddCreditComponent
                wallets = {[]} />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with BTC option', () => {

        const wrapper = shallow(
            <AddCreditComponent
                wallets = {[]}
                showCredits = { () => {} } />
        );

        wrapper.setState({ showBasicWallets: false, showBTCCredits: true });

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with Storj option', () => {

        const wrapper = shallow(
            <AddCreditComponent
                wallets = {[]} />
        );

        wrapper.setState({ showBasicWallets: false, showStorjCredits: true });

        expect(wrapper).toMatchSnapshot();
    });

    it('triggers functions correctly with BTC option', () => {
        const showCreditsSpy = jest.fn();

        const wrapper = shallow(
            <AddCreditComponent
                wallets = {[]}
                showCredits = { showCreditsSpy } />
        );

        wrapper.setState({ showBasicWallets: false, showBTCCredits: true });

        expect(showCreditsSpy.mock.calls.length).toBe(1);
    });

    it('triggers functions correctly with Storj option', () => {
        const createWalletSpy = jest.fn();

        const wrapper = shallow(
            <AddCreditComponent
                wallets = {[]}
                createWallet = { createWalletSpy } />
        );

        wrapper.setState({ showBasicWallets: false, showStorjCredits: true });

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(createWalletSpy.mock.calls.length).toBe(1);
    });
});