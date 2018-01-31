import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Animated,
    PanResponder,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import { getWidth, getHeight } from '../utils/adaptive';

/**
* Slider component with styled buttons
*/
export default class ContentSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: this.props.position,
            height: this.props.height,
            width: this.props.width,
            content: this.props.content.map((view, index) => {
                return {
                    isSelected: index === 0,
                    index: index
                };
            })
        };

        this.ref = null;
    }

    _onRef(ref) {
        this.ref = ref;
    }

    /**
    * Moving selected button
    * @param {string} nextPosition next position of content
    */
    move(nextPosition) {        
        nextPosition += this.state.position;
        if(nextPosition > 1 || nextPosition < 0 || !this.ref) return;
        
        this.ref.scrollTo({x: this.state.width * nextPosition, y: 0, animated: true});
        this.setState({
            position: nextPosition, 
            content: this.state.content.map((item) => {
                return {
                    isSelected: nextPosition === item.index,
                    index: item.index
                };
            })
        });
    }

    /**
    * Occurs on button click
    * @param {number} index next position of content
    */
    onButtonClick(index) {
        if(this.state.position === index) return;
        
        let nextPosition = this.state.position === 1 ? -1 : 1;
        
        this.move(nextPosition);
    }

    /**
    * Occurs on horizontal swipe
    * @param {object} event scroll event 
    */
    onSwipe(event) {
        let nextPosition = event.nativeEvent.contentOffset.x <= 0 ? -1 : 1;
        
        this.move(nextPosition);
    }

    render() {
        const width = this.state.width;
        const height = this.state.height;
        return (
            <View style={ [styles.mainContainer, this.props.style ]}>
                <ScrollView
                    ref = { ref => this._onRef(ref) }
                    decelerationRate = { 0.99 }
                    horizontal = { true }
                    scrollEnabled = { true }
                    onMomentumScrollEnd = { (event) => { this.onSwipe(event) } }
                    showsHorizontalScrollIndicator = { false }
                    style={ styles.container }>
                    { this.state.content.map((item) => {                    
                            return(
                                <View
                                    key = { item.index }
                                    style = { { height, width } } >
                                    { this.props.content[item.index] }
                                </View>
                            );
                    })}
                </ScrollView>
                <View style={styles.buttons}>
                    { this.state.content.map((item) => {
                        return (
                            <TouchableHighlight
                                key = { item.index }
                                underlayColor = "#ccc"
                                onPressOut = { () => { this.onButtonClick(item.index); } }
                                style = { [ styles.button, item.isSelected ? styles.buttonSelected : null ] }>
                                <View/>
                            </TouchableHighlight>
                        );
                    })}
                </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    container: {
    },
    scrollContainer: {
        flex: 1
    },
    buttons: {
        paddingVertical: getHeight(20),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: getWidth(37)
    },
    button: {
        marginRight: getWidth(11),
        width: getHeight(8),
        height: getHeight(8),
        borderRadius: 8 / 2,
        backgroundColor: 'white',
        borderColor: '#c6d5df',
        borderWidth: 1.3
    },
    buttonSelected: {
        opacity: 1,
        backgroundColor: '#c6d5df',
    }
});