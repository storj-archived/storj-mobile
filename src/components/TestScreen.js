import {
    View,
    Text,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';

export default class TestComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <Text>Test</Text>
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