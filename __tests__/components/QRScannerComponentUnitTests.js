import {
    TouchableOpacity
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import QRScannerComponent from '../../src/components/QRScannerComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('QRScannerComponent', () => {

    it('renders correctly', () => {
        const wrapper = shallow(
            <QRScannerComponent 
                viewAppear = { true } />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with error with scanning', () => {
        const wrapper = shallow(
            <QRScannerComponent
                borderColor = { '#EB5757' } />
        );

        expect(wrapper.find('Image').length).toBe(4);
    });
});