import {
    StatusBar,
    Text
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WarningComponent from '../../src/components/Common/WarningComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('WarningComponent', () => {

    it('renders correctly', () => {
        const wrapper = shallow(
            <WarningComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with props', () => {
        const wrapper = shallow(
            <WarningComponent 
                message = { 'test message' }
                statusBarColor = { 'red' } />
        );

        expect(wrapper.containsMatchingElement(<StatusBar backgroundColor = { 'red' }/>)).toBe(true);
        expect(wrapper.containsMatchingElement(<Text>test message</Text>)).toBe(true);
    });
});