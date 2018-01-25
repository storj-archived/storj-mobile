import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'; 
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import MnemonicGenerationComponent from '../../src/components/MnemonicGenerationComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('MnemonicGenerationComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <MnemonicGenerationComponent 
            navigation = { { state: { params: { mnemonic: 'mnemonic' } } } }/>
        );

        expect(wrapper).toMatchSnapshot();
    });
});