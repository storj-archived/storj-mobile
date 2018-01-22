import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import Checkbox from '../../src/components/CheckboxComponent';

Enzyme.configure({ adapter: new Adapter() });


describe('CheckboxComponent', () => {
    it('renders correctly', () => {
        const wrapper = shallow(
            <Checkbox />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('triggers onPress on TouchableOpacity press', () => {
        const wrapper = shallow(
            <Checkbox 
                onPress={ () => {} } />
        );

        const onPressSpy = sinon.spy(wrapper.instance(), 'onPress');

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(onPressSpy.calledOnce).toBe(true);
    });

    it('triggers setState on TouchableOpacity press', () => {
        const wrapper = shallow(
            <Checkbox 
                onPress={ () => {} } />
        );

        const setStateSpy = sinon.spy(wrapper.instance(), 'setState');

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(setStateSpy.calledOnce).toBe(true);
    });

    it('change state correctly on TouchableOpacity press', () => {
        const wrapper = shallow(
            <Checkbox 
                onPress={ () => {} } 
                isChecked = { false } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(wrapper.instance().state.isChecked).toBe(true);
    });

    it('triggers onPress from props on touchableOpacity press', () => {
        const onPressSpy = jest.fn();

        const wrapper = shallow(
            <Checkbox 
                onPress={ onPressSpy } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(onPressSpy.mock.calls.length).toBe(1);
    });
});