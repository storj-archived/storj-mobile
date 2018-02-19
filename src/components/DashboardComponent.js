import {
    View,
    Text
} from 'react-native';
import React, { Component } from 'react';


export default class DashboardComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>DashboardComponent</Text>
            </View>
        );
    }
}