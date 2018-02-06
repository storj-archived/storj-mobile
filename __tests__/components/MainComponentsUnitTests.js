import {
    View
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MainComponent from '../../src/components/MainComponent';
import ActionBarComponent from '../../src/components/ActionBarComponent';
import CreateBucketPopUpComponent from '../../src/components/InputPopUpComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('MainComponent', () => {    

	it('renders correctly', () => {

		const wrapper = shallow(
			<MainComponent />
        );
        
		expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with ActionBarShown', () => {

		const wrapper = shallow(
			<MainComponent 
                isActionBarShown = { true } />
        );

        expect(wrapper.containsMatchingElement(<ActionBarComponent />)).toBe(true);
        expect(wrapper.containsMatchingElement(<CreateBucketPopUpComponent />)).toBe(false);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with ActionBarShown', () => {

		const wrapper = shallow(
			<MainComponent 
                isSelectionMode = { true } />
        );

        expect(wrapper.containsMatchingElement(<ActionBarComponent />)).toBe(true);
        expect(wrapper.containsMatchingElement(<CreateBucketPopUpComponent />)).toBe(false);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with ActionBarShown', () => {

		const wrapper = shallow(
			<MainComponent 
                isCreateBucketInputShown = { true } />
        );

        expect(wrapper.containsMatchingElement(<ActionBarComponent />)).toBe(false);
        expect(wrapper.containsMatchingElement(<CreateBucketPopUpComponent />)).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with ActionBarShown', () => {

		const wrapper = shallow(
			<MainComponent 
                isCreateBucketInputShown = { true } 
                isActionBarShown = { true } />
        );

        expect(wrapper.containsMatchingElement(<ActionBarComponent />)).toBe(true);
        expect(wrapper.containsMatchingElement(<CreateBucketPopUpComponent />)).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });
});
