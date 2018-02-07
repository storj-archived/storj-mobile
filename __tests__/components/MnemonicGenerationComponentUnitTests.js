import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Alert
} from 'react-native';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'; 
import sinon from 'sinon';
import MnemonicGenerationComponent from '../../src/components/MnemonicGenerationComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('MnemonicGenerationComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with pressOut', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent />
        );

        const expectedState = { mnemonic: null,
            email: null,
            isLoading: true,
            showMnemonic: true,
            showModal: false,
            isMnemonicCopied: false,
            showConfirmation: false };

        wrapper.find('TouchableOpacity').forEach((child) =>{
            child.simulate('PressOut')
        });

        expect(wrapper.state()).toEqual(expectedState);
    });

    it('renders correctly with default state', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent />
        );

        expect(wrapper.containsMatchingElement(<Text>GET MNEMONIC</Text>)).toBe(true);
    });

    it('renders correctly with changing state to { isLoading: false, showMnemonic: true, mnemonic: someValue }', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent />
        );

        wrapper.setState({ isLoading: false, showMnemonic: true, mnemonic: 'someValue' });

        expect(wrapper.containsMatchingElement(<TextInput value = { wrapper.state().mnemonic } />)).toBe(true);
    });

    it('renders correctly with changing state to { showModal: true }', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent />
        );

        wrapper.setState({ showModal: true });

        expect(wrapper.containsMatchingElement(<Text>Copy to Clipboard</Text>)).toBe(true);
    });

    it('renders correctly with changing state to { showModal: false, isMnemonicCopied: true }', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent />
        );

        wrapper.setState({ showMnemonic : true, showModal: false, isMnemonicCopied: true, isLoading: false });

        expect(wrapper.containsMatchingElement(<Text>CONTINUE</Text>)).toBe(true);
    });

    it('renders correctly with changing state to { showConfirmation: true }', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent />
        );

        wrapper.setState({ showConfirmation: true });

        expect(wrapper.containsMatchingElement(Alert)).toBe(true);
    });
});