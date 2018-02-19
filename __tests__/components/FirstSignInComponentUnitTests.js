import {
    TouchableOpacity,
    Text
} from 'react-native';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'; 
import sinon from 'sinon';
import FirstSignInComponent from '../../src/components/FirstSignInComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('FirstSignInComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <FirstSignInComponent />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('correct state when showModal is false', () => {
        const wrapper = shallow(
            <FirstSignInComponent />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('PressOut');
        });

        expectedState = { 
            androidOptions: [ 
                { type: 'photos', isSelected: false, title: 'My photos' },
                { type: 'videos', isSelected: false, title: 'My videos' },
                { type: 'music', isSelected: false, title: 'My music' },
                { type: 'files', isSelected: false, title: 'Files' } ],
            showModal: true
        }

        expect(wrapper.state()).toEqual(expectedState);
    });

    it('correct rendering showModal is false', () => {

        const wrapper = shallow(
            <FirstSignInComponent />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('PressOut');
        });

        expect(wrapper.containsMatchingElement(<Text>What do you want to sync?</Text>)).toBe(true);
    });

    it('correct functions invokes count when showModal is false', () => {
        const creationSpy = jest.fn()

        const wrapper = shallow(
            <FirstSignInComponent 
                createBucket = { creationSpy } />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('PressOut');
        });

        expect(creationSpy.mock.calls.length).toBe(0);
    });

    it('correct rendering when showModal is true', () => {

        const wrapper = shallow(
            <FirstSignInComponent />
        );

        wrapper.setState({ showModal: true });

        expect(wrapper.containsMatchingElement(<Text>What do you want to sync?</Text>)).toBe(true);
    });

    it('correct state when showModal is true and sync option pressed', () => {

        const wrapper = shallow(
            <FirstSignInComponent />
        );

        wrapper.setState({ showModal: true });

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expectedState = { 
            androidOptions: [ 
                { type: 'photos', isSelected: true, title: 'My photos' },
                { type: 'videos', isSelected: true, title: 'My videos' },
                { type: 'music', isSelected: true, title: 'My music' },
                { type: 'files', isSelected: true, title: 'Files' } ],
            showModal: false
        }

        expect(wrapper.state()).toEqual(expectedState);
    });

    it('correct functions invokes count when showModal is true', () => {
        const creationSpy = jest.fn()

        const wrapper = shallow(
            <FirstSignInComponent 
                createBucket = { creationSpy } />
        );

        wrapper.setState({ showModal: true });


        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(creationSpy.mock.calls.length).toBe(4);
    });
})