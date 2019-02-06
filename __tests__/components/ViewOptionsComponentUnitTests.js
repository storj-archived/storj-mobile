import {
    Text,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ViewOptionsComponent from '../../src/components/Header/ViewOptionsComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('ViewOptionsComponent', () => {

    it('renders correctly', () => {
        const wrapper = shallow(
            <ViewOptionsComponent
                enableSelectionMode = { () => {} } />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with not isGridViewShown', () => {
        const wrapper = shallow(
            <ViewOptionsComponent
                isGridViewShown = { false }
                enableSelectionMode = { () => {} } />
        );

        expect(wrapper.containsMatchingElement(<Text>Grid view</Text>)).toBe(true);
    });

    it('renders correctly with isGridViewShown', () => {
        const wrapper = shallow(
            <ViewOptionsComponent
                isGridViewShown = { true }
                enableSelectionMode = { () => {} } />
        );

        expect(wrapper.containsMatchingElement(<Text>List view</Text>)).toBe(true);
    });

    it('trigger actions on press correctly with not isGridViewShown', () => {
        const setListViewSpy = jest.fn();
        const setGridViewSpy = jest.fn();
        const showOptionsSpy = jest.fn();

        const wrapper = shallow(
            <ViewOptionsComponent
                showOptions = { showOptionsSpy }
                isGridViewShown = { false }
                setListView = { setListViewSpy }
                setGridView = { setGridViewSpy }
                enableSelectionMode = { () => {} } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(setListViewSpy.mock.calls.length).toBe(0);
        expect(showOptionsSpy.mock.calls.length).toBe(3);
        expect(setGridViewSpy.mock.calls.length).toBe(1);
    });

    it('trigger actions on press correctly with isGridViewShown', () => {
        const setListViewSpy = jest.fn();
        const setGridViewSpy = jest.fn();
        const showOptionsSpy = jest.fn();

        const wrapper = shallow(
            <ViewOptionsComponent
                showOptions = { showOptionsSpy }
                isGridViewShown = { true }
                setListView = { setListViewSpy }
                setGridView = { setGridViewSpy }
                enableSelectionMode = { () => {} } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(showOptionsSpy.mock.calls.length).toBe(3);
        expect(setListViewSpy.mock.calls.length).toBe(1);
        expect(setGridViewSpy.mock.calls.length).toBe(0);
    });
});