import {
    View,
    TextInput,
    Button,
    RefreshControl,
    NativeModules
} from 'react-native';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store';
import Enzyme, { shallow } from 'enzyme'; 
import ListComponent from '../../src/components/ListComponent';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();

describe('ListComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <ListComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('triggers refresh correctly', () => {
        const refreshSpy = jest.fn();

        const wrapper = shallow(
            <ListComponent
             onRefresh = { refreshSpy } />
        );

        wrapper.find('RefreshControl').forEach(child => {
            child.simulate('Refresh');
        });

        expect(refreshSpy.mock.calls.length).toBe(1);
    });
});