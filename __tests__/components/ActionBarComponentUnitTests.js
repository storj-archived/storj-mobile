import {
    View,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ActionBarComponent from '../../src/components/ActionBarComponent';
import TabBarActionModelFactory from '../../src/models/TabBarActionModel';

Enzyme.configure({ adapter: new Adapter() });

describe('ActionBarComponent', () => {    

	it('renders correctly with SelectionMode and SingleItemSelected', () => {
        const pressSpy = jest.fn();

        tapBarActions = [
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 2', 'icon'),
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 3', 'icon')
        ];

        selectionModeActions = [
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 2', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 3', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 3', 'icon')
        ];

		const wrapper = shallow(
			<ActionBarComponent 
                isSelectionMode = { false } 
                isSingleItemSelected = { true }
                selectionModeActions = { selectionModeActions }
                actions = { tapBarActions } />
        );
        
		expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with not SelectionMode and not SingleItemSelected', () => {
        const pressSpy = jest.fn();

        tapBarActions = [
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 2', 'icon'),
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 3', 'icon')
        ];

        selectionModeActions = [
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 2', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 3', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 3', 'icon')
        ];

		const wrapper = shallow(
			<ActionBarComponent 
                isSelectionMode = { false } 
                isSingleItemSelected = { false }
                selectionModeActions = { selectionModeActions }
                actions = { tapBarActions } />
        );
        
		expect(wrapper).toMatchSnapshot();
    });
    
    it('triggers onPress correctly with SelectionMode and not SingleItemSelected', () => {
        const tabSpy = jest.fn();
        const pressSpy = jest.fn();
        const deleteSpy = jest.fn();

        tapBarActions = [
            TabBarActionModelFactory.createNewAction(tabSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(tabSpy, 'Action 2', 'icon'),
            TabBarActionModelFactory.createNewAction(tabSpy, 'Action 3', 'icon')
        ];

        selectionModeActions = [
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 2', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 3', 'icon'), 
            TabBarActionModelFactory.createNewAction(deleteSpy, 'Action 3', 'icon')
        ];

		const wrapper = shallow(
			<ActionBarComponent 
                isSelectionMode = { true } 
                isSingleItemSelected = { false }
                selectionModeActions = { selectionModeActions }
                actions = { tapBarActions } />
        );
        
        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(tabSpy.mock.calls.length).toBe(3);
        expect(pressSpy.mock.calls.length).toBe(0);
        expect(deleteSpy.mock.calls.length).toBe(0);
    });

    it('triggers onPress correctly with not SelectionMode and SingleItemSelected', () => {
        const tabSpy = jest.fn();
        const pressSpy = jest.fn();
        const deleteSpy = jest.fn();

        tapBarActions = [
            TabBarActionModelFactory.createNewAction(tabSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(tabSpy, 'Action 2', 'icon'),
            TabBarActionModelFactory.createNewAction(tabSpy, 'Action 3', 'icon')
        ];

        selectionModeActions = [
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 2', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 3', 'icon'), 
            TabBarActionModelFactory.createNewAction(deleteSpy, 'Action 3', 'icon')
        ];

		const wrapper = shallow(
			<ActionBarComponent 
                isSelectionMode = { false } 
                isSingleItemSelected = { true }
                selectionModeActions = { selectionModeActions }
                actions = { tapBarActions } />
        );
        
        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

		expect(tabSpy.mock.calls.length).toBe(3);
        expect(pressSpy.mock.calls.length).toBe(0);
        expect(deleteSpy.mock.calls.length).toBe(0);
    });

    it('triggers onPress correctly with not SelectionMode and not SingleItemSelected', () => {
        const tabSpy = jest.fn();
        const pressSpy = jest.fn();
        const deleteSpy = jest.fn();

        tapBarActions = [
            TabBarActionModelFactory.createNewAction(tabSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(tabSpy, 'Action 2', 'icon'),
            TabBarActionModelFactory.createNewAction(tabSpy, 'Action 3', 'icon')
        ];

        selectionModeActions = [
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 1', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 2', 'icon'), 
            TabBarActionModelFactory.createNewAction(pressSpy, 'Action 3', 'icon'), 
            TabBarActionModelFactory.createNewAction(deleteSpy, 'Action 3', 'icon')
        ];

		const wrapper = shallow(
			<ActionBarComponent 
                isSelectionMode = { false } 
                isSingleItemSelected = { false }
                selectionModeActions = { selectionModeActions }
                actions = { tapBarActions } />
        );
        
        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

		expect(tabSpy.mock.calls.length).toBe(3);
        expect(pressSpy.mock.calls.length).toBe(0);
        expect(deleteSpy.mock.calls.length).toBe(0);
    });
});
