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
import MnemonicGenerationComponent from '../../src/components/Mnemonic/MnemonicGenerationComponent';

Enzyme.configure({ adapter: new Adapter() });

// TODO: update this test

describe('MnemonicGenerationComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });
});