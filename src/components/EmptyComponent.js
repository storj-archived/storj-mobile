import {
    View
} from 'react-native';
import React, { Component } from 'react';

export default class EmptyComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
            </View>
        );
    }
}