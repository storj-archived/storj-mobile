import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import InputComponent from '../../src/components/InputComponent';

Enzyme.configure({ adapter: new Adapter() });


describe('InputComponent', () => {
    it('renders correctly', () => {
        const wrapper = shallow(
            <InputComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with multiline', () => {
        const wrapper = shallow(
            <InputComponent 
                multiline = { true }/>
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('triggers onChangeText correctly', () => {
        const onChangeTextSpy = jest.fn();

        const wrapper = shallow(
            <InputComponent 
                onChangeText = { onChangeTextSpy } />
        );

        wrapper.find('TextInput').forEach(child => {
            child.simulate('ChangeText');
        });

        expect(onChangeTextSpy.mock.calls.length).toBe(1);
    });

    it('triggers setState on Press', () => {
        const wrapper = shallow(
            <InputComponent 
                isPassword = { true } />
        );

        const handle = wrapper.instance();
        const setStateSpy = sinon.spy(handle, 'setState');

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(setStateSpy.calledOnce).toBe(true);
    });

    it('changes state correctly on Press', () => {
        const wrapper = shallow(
            <InputComponent 
                isPassword = { true } />
        );

        const handle = wrapper.instance();

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(handle.state.isTextShown).toBe(false);
    });
});