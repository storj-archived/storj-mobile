import {
    Text,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TabBarComponent from '../../src/components/TabBarComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('TabBarComponent', () => {

    it('renders correctly', () => {
        const wrapper = shallow(
            <TabBarComponent
                navigationState = { { index: 0 } }
                navigation = { { 
                    isSelectionMode: false,
                    isSingleItemSelected: false,
                    isActionBarShown: false
                } }
                screenProps = {{
                    setCurrentMainScreen: () => {}
                }} />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with isSelectionMode', () => {
        const wrapper = shallow(
            <TabBarComponent
                navigationState = { { index: 0 } }
                navigation = { { 
                    isSelectionMode: true,
                    isSingleItemSelected: false,
                    isActionBarShown: false
                } }
                screenProps = {{
                    isFirstSignIn: false
                }} />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with isActionBarShown', () => {
        const wrapper = shallow(
            <TabBarComponent
                navigationState = { { index: 0 } }
                navigation = { { 
                    isSelectionMode: false,
                    isSingleItemSelected: false,
                    isActionBarShown: true
                } }
                screenProps = {{
                    isFirstSignIn: false
                }} />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with isSingleItemSelected', () => {
        const wrapper = shallow(
            <TabBarComponent
                navigationState = { { index: 0 } }
                navigation = { { 
                    isSelectionMode: false,
                    isSingleItemSelected: true,
                    isActionBarShown: false
                } }
                screenProps = {{
                    isFirstSignIn: false
                }} />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('trigger actions on press correctly with not isSingleItemSelected and not isSelectionMode', () => {
        const navigateSpy = jest.fn();
        const goToBucketScreenSpy = jest.fn();
        const onActionBarPressSpy = jest.fn();
        const setMainScreenSpy = jest.fn();
        const openBucketSpy = jest.fn();
        const dashboardNavigateBackSpy = jest.fn();
        const bucketNavigateBackSpy = jest.fn();
        const hideActionBarSpy = jest.fn();

        const wrapper = shallow(
            <TabBarComponent
                navigationState = { { index: 0 } }
                navigation = { { 
                    navigate: navigateSpy, 
                    goToBucketsScreen: goToBucketScreenSpy,
                    onActionBarPress: onActionBarPressSpy,
                    openBucket: openBucketSpy,
                    dashboardNavigateBack: dashboardNavigateBackSpy,
                    bucketNavigateBack: bucketNavigateBackSpy,
                    buckets: [],
                    hideActionBar: hideActionBarSpy,
                    isSelectionMode: false,
                    isSingleItemSelected: false
                } }
                screenProps = {{
                    setCurrentMainScreen: setMainScreenSpy,
                    isFirstSignIn: false
                }} />
        );

        wrapper.find('TouchableOpacity').forEach(child => {
            child.simulate('Press');
        });

        expect(navigateSpy.mock.calls.length).toBe(3);
        expect(goToBucketScreenSpy.mock.calls.length).toBe(0);
        expect(openBucketSpy.mock.calls.length).toBe(0);
        expect(setMainScreenSpy.mock.calls.length).toBe(0);
        expect(onActionBarPressSpy.mock.calls.length).toBe(0);
        expect(dashboardNavigateBackSpy.mock.calls.length).toBe(0);
        expect(bucketNavigateBackSpy.mock.calls.length).toBe(0);
        expect(hideActionBarSpy.mock.calls.length).toBe(1);
    });
});