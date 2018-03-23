
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ContentSlider from '../../src/components/ContentSliderComponent';
import sinon from 'sinon';

Enzyme.configure({ adapter: new Adapter() });

describe('ContentSlider', () => {
    it('renders correctly', () => {
        const wrapper = shallow(
            <ContentSlider 
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]}/>
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('buttons number is correct №1', () => {
        const wrapper = shallow(
            <ContentSlider
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]} />
        );

        expect(wrapper.find('TouchableHighlight').length).toBe(2);
    });

    it('buttons number is correct №2', () => {
        const wrapper = shallow(
            <ContentSlider
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]} />
        );

        expect(wrapper.find('TouchableHighlight').length).toBe(3);
    });

    it('buttons works correct', () => {
        const wrapper = shallow(
            <ContentSlider
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]}
                position = { 0 }
                width = { 600 }
                height = { 600 } />
        );

        wrapper.instance().ref = { scrollTo: () => {} }

        let iterator = 0;
        wrapper.find('TouchableHighlight').forEach(child => {
            if(iterator === 1) {
                child.simulate('PressOut');
                expect(wrapper.instance().state.position).toBe(1);
            }
            
            iterator++;
        });      

        iterator = 0;
        
        wrapper.find('TouchableHighlight').forEach(child => {
            if(iterator === 0) {
                child.simulate('PressOut');
                expect(wrapper.instance().state.position).toBe(0);
            }
            
            iterator++;
        });      
    });

    it('clicking the same button doesnt change position №1', () => {
        const wrapper = shallow(
            <ContentSlider
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]}
                position = { 1 }
                width = { 600 }
                height = { 600 } />
        );

        var instance = wrapper.instance();
        instance.ref = { scrollTo: () => {} }

        instance.onButtonClick(1);

        expect(wrapper.instance().state.position).toBe(1);
    });

    it('clicking the same button doesnt change position №1', () => {
        const wrapper = shallow(
            <ContentSlider
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]}
                position = { 0 }
                width = { 600 }
                height = { 600 } />
        );

        var instance = wrapper.instance();
        instance.ref = { scrollTo: () => {} }

        instance.onButtonClick(0);

        expect(wrapper.instance().state.position).toBe(0);
    });

    it('swipe right works correct', () => {
        const wrapper = shallow(
            <ContentSlider
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]}
                position = { 0 }
                width = { 600 }
                height = { 600 } />
        );

        var instance = wrapper.instance();
        instance.ref = { scrollTo: () => {} }

        const swipeSpy = sinon.spy(instance, 'onSwipe');
        instance.onSwipe({nativeEvent:{contentOffset:{x: 10}}});

        expect(wrapper.instance().state.position).toBe(1);
    });

    it('swipe left works correct', () => {
        const wrapper = shallow(
            <ContentSlider
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]}
                position = { 1 }
                width = { 600 }
                height = { 600 } />
        );

        var instance = wrapper.instance();
        instance.ref = { scrollTo: () => {} }

        const swipeSpy = sinon.spy(instance, 'onSwipe');
        instance.onSwipe({nativeEvent:{contentOffset:{x: -10}}});

        expect(wrapper.instance().state.position).toBe(0);
    });

    it('swipe left doesnt work from first position', () => {
        const wrapper = shallow(
            <ContentSlider
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]}
                position = { 0 }
                width = { 600 }
                height = { 600 } />
        );

        var instance = wrapper.instance();
        instance.ref = { scrollTo: () => {} }

        const swipeSpy = sinon.spy(instance, 'onSwipe');
        instance.onSwipe({nativeEvent:{contentOffset:{x: -10}}});

        expect(wrapper.instance().state.position).toBe(0);
    });

    it('swipe right doesnt work from last position', () => {
        const wrapper = shallow(
            <ContentSlider
                content = {[ 
                    () => { return(<View/>) },
                    () => { return(<View/>) }
                ]}
                position = { 1 }
                width = { 600 }
                height = { 600 } />
        );

        var instance = wrapper.instance();
        instance.ref = { scrollTo: () => {} }

        const swipeSpy = sinon.spy(instance, 'onSwipe');
        instance.onSwipe({nativeEvent:{contentOffset:{x: 10}}});

        expect(wrapper.instance().state.position).toBe(1);
    });
});