import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import MyAccountScreenNavigator from '../../navigators/MyAccountScreenNavigator';

export default class MyAccountNavComponent extends Component {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <MyAccountScreenNavigator
                    animatedScrollValue = { this.animatedScrollValue }  />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});