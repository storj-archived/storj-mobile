import {
    TouchableOpacity,
    Text
} from 'react-native';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'; 
import sinon from 'sinon';
import FirstSignInComponent from '../../src/components/Login/FirstSignInComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('FirstSignInComponent', () => {

    it('renders correctly', () => {

        const wrapper = shallow(
            <FirstSignInComponent
                SYNC_ENUM = { {
                    SYNC_PHOTOS: () => {},
                    SYNC_MOVIES: () => {},
                    SYNC_DOCUMENTS: () => {},
                    SYNC_MUSIC: () => {},
                } }
                options = {[
                    { type: 'Pictures', isSelected: false, title: 'My photos', mask: 16},
                    { type: 'Movies', isSelected: false, title: 'My movies', mask: 8 },
                    { type: 'Documents', isSelected: false, title: 'My documents', mask: 4 },
                    { type: 'Music', isSelected: false, title: 'My music', mask: 2 }
                ]} />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('correct state when showModal is false', () => {
        const wrapper = shallow(
            <FirstSignInComponent
                SYNC_ENUM = { {
                    SYNC_PHOTOS: 16,
                    SYNC_MOVIES: 8,
                    SYNC_DOCUMENTS: 4,
                    SYNC_MUSIC: 2,
                } }
                options = {[
                    { type: 'Pictures', isSelected: false, title: 'My photos', mask: 16},
                    { type: 'Movies', isSelected: false, title: 'My movies', mask: 8 },
                    { type: 'Documents', isSelected: false, title: 'My documents', mask: 4 },
                    { type: 'Music', isSelected: false, title: 'My music', mask: 2 }
                ]} />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('PressOut');
        });

        expectedState = { 
            options: [ 
                { type: 'Pictures', isSelected: false, title: 'My photos', mask: 16 },
                { type: 'Movies', isSelected: false, title: 'My movies', mask: 8 },
                { type: 'Documents', isSelected: false, title: 'My documents', mask: 4 },
                { type: 'Music', isSelected: false, title: 'My music', mask: 2 } ],
            showModal: true
        };

        expect(wrapper.state()).toEqual(expectedState);
    });

    it('correct rendering showModal is false', () => {

        const wrapper = shallow(
            <FirstSignInComponent
                SYNC_ENUM = { {
                    SYNC_PHOTOS: () => {},
                    SYNC_MOVIES: () => {},
                    SYNC_DOCUMENTS: () => {},
                    SYNC_MUSIC: () => {},
                } }
                options = {[
                    { type: 'Pictures', isSelected: false, title: 'My photos', mask: 16},
                    { type: 'Movies', isSelected: false, title: 'My movies', mask: 8 },
                    { type: 'Documents', isSelected: false, title: 'My documents', mask: 4 },
                    { type: 'Music', isSelected: false, title: 'My music', mask: 2 }
                ]} />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('PressOut');
        });

        expect(wrapper.containsMatchingElement(<Text>What do you want to sync?</Text>)).toBe(true);
    });

    it('correct functions invokes count when showModal is false', () => {
        const creationSpy = jest.fn();

        const wrapper = shallow(
            <FirstSignInComponent 
                createBucket = { creationSpy }
                SYNC_ENUM = { {
                    SYNC_PHOTOS: () => {},
                    SYNC_MOVIES: () => {},
                    SYNC_DOCUMENTS: () => {},
                    SYNC_MUSIC: () => {},
                } }
                options = {[
                    { type: 'Pictures', isSelected: false, title: 'My photos', mask: 16},
                    { type: 'Movies', isSelected: false, title: 'My movies', mask: 8 },
                    { type: 'Documents', isSelected: false, title: 'My documents', mask: 4 },
                    { type: 'Music', isSelected: false, title: 'My music', mask: 2 }
                ]} />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('PressOut');
        });

        expect(creationSpy.mock.calls.length).toBe(0);
    });

    it('correct rendering when showModal is true', () => {

        const wrapper = shallow(
            <FirstSignInComponent
                SYNC_ENUM = { {
                    SYNC_PHOTOS: () => {},
                    SYNC_MOVIES: () => {},
                    SYNC_DOCUMENTS: () => {},
                    SYNC_MUSIC: () => {},
                } }
                options = {[
                    { type: 'Pictures', isSelected: false, title: 'My photos', mask: 16},
                    { type: 'Movies', isSelected: false, title: 'My movies', mask: 8 },
                    { type: 'Documents', isSelected: false, title: 'My documents', mask: 4 },
                    { type: 'Music', isSelected: false, title: 'My music', mask: 2 }
                ]} />
        );

        wrapper.setState({ showModal: true });

        expect(wrapper.containsMatchingElement(<Text>What do you want to sync?</Text>)).toBe(true);
    });

    it('correct state when showModal is true and sync option pressed', () => {

        const wrapper = shallow(
            <FirstSignInComponent
                SYNC_ENUM = { {
                    SYNC_PHOTOS: 16,
                    SYNC_MOVIES: 8,
                    SYNC_DOCUMENTS: 4,
                    SYNC_MUSIC: 2,
                } }
                options = {[
                    { type: 'Pictures', isSelected: false, title: 'My photos', mask: 16},
                    { type: 'Movies', isSelected: false, title: 'My movies', mask: 8 },
                    { type: 'Documents', isSelected: false, title: 'My documents', mask: 4 },
                    { type: 'Music', isSelected: false, title: 'My music', mask: 2 }
                ]} />
        );

        wrapper.setState({ showModal: true });

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expectedState = { 
            options: [ 
                { type: 'Pictures', isSelected: true, title: 'My photos', mask: 16 },
                { type: 'Movies', isSelected: true, title: 'My movies', mask: 8 },
                { type: 'Documents', isSelected: true, title: 'My documents', mask: 4 },
                { type: 'Music', isSelected: true, title: 'My music', mask: 2 } ],
            showModal: false
        };

        expect(wrapper.state()).toEqual(expectedState);
    });

    it('correct functions invokes count when showModal is true', () => {
        const creationSpy = jest.fn();

        const wrapper = shallow(
            <FirstSignInComponent 
                createBucket = { creationSpy }
                SYNC_ENUM = { {
                    SYNC_PHOTOS: () => {},
                    SYNC_MOVIES: () => {},
                    SYNC_DOCUMENTS: () => {},
                    SYNC_MUSIC: () => {},
                } }
                options = {[
                    { type: 'Pictures', isSelected: false, title: 'My photos', mask: 16},
                    { type: 'Movies', isSelected: false, title: 'My movies', mask: 8 },
                    { type: 'Documents', isSelected: false, title: 'My documents', mask: 4 },
                    { type: 'Music', isSelected: false, title: 'My music', mask: 2 }
                ]} />
        );

        wrapper.setState({ showModal: true });


        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(creationSpy.mock.calls.length).toBe(4);
    });
});