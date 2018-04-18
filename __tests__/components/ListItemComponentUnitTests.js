import {
    View,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import ListItemComponent from '../../src/components/ListItemComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('ListItemComponent', ()=> {

	it('renders correctly', () => {
		const wrapper = shallow(
			<ListItemComponent 
                item = {{ getName: () => {}, getStarred: () => {}, entity: { thumbnail: {} } }} />	
		);

		expect(wrapper).toMatchSnapshot();
	});

	it('triggers onPress correctly with SelectionModeEnabled and SingleItemSelected', () => {
        const selectItemIdSpy = jest.fn();
        const disableSelectionModeSpy = jest.fn();

		const wrapper = shallow(
            <ListItemComponent 
                item = {{ getName: () => {}, getStarred: () => {}, entity: { thumbnail: {} } }}
                isSelectionModeEnabled = { true }
                isSingleItemSelected = { true }
                selectItemId = { selectItemIdSpy }
                disableSelectionMode = { disableSelectionModeSpy } />
        );
        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(selectItemIdSpy.mock.calls.length).toBe(1);
        expect(disableSelectionModeSpy.mock.calls.length).toBe(1);
    }); 
    
    it('triggers onPress correctly with not SelectionModeEnabled and SingleItemSelected', () => {
        const selectItemIdSpy = jest.fn();
        const disableSelectionModeSpy = jest.fn();

		const wrapper = shallow(
			<ListItemComponent 
                item = {{ getName: () => {}, getStarred: () => {}, entity: { thumbnail: {} } }}
                isSelectionModeEnabled = { false }
                isSingleItemSelected = { true }
                selectItemId = { selectItemIdSpy }
                disableSelectionMode = { disableSelectionModeSpy } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(selectItemIdSpy.mock.calls.length).toBe(2);
		expect(disableSelectionModeSpy.mock.calls.length).toBe(2);
	}); 

    it('triggers onPress correctly with not SelectionModeEnabled and not SingleItemSelected', () => {
        const selectItemIdSpy = jest.fn();
        const onSingleItemSelectedSpy = jest.fn();
        const onSelectionPressSpy = jest.fn();
        const pressSpy = jest.fn();

		const wrapper = shallow(
			<ListItemComponent 
                item = {{ getName: () => {}, getStarred: () => {}, getId: () => {}, entity: {bucketId: null, thumbnail: {}} }}
                isSelectionModeEnabled = { false }
                isSingleItemSelected = { false }
                onSelectionPress = { onSelectionPressSpy }
                selectItemId = { selectItemIdSpy }
                onSingleItemSelected = { onSingleItemSelectedSpy }
                onPress = { pressSpy } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(selectItemIdSpy.mock.calls.length).toBe(1);
        expect(onSelectionPressSpy.mock.calls.length).toBe(1);
        expect(onSingleItemSelectedSpy.mock.calls.length).toBe(1);
		expect(pressSpy.mock.calls.length).toBe(1);
    });
    
    it('triggers onLongPress correctly ', () => {
        const longPressSpy = jest.fn();

		const wrapper = shallow(
            <ListItemComponent 
                item = {{ getName: () => {}, getStarred: () => {}, getId: () => {}, entity: {bucketId: null} }}
                onLongPress = { longPressSpy } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('LongPress');
        });

		expect(longPressSpy.mock.calls.length).toBe(1);
	});
});

