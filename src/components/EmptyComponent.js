import {
    View,
    Text
} from 'react-native';
import React, { Component } from 'react';
import StorjLib from '../utils/StorjModule';

//dc2d276294df3c6447423b1f bucket id
//355f4998341be2f6453a3beb file id

export default class EmptyComponent extends Component{
    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        console.log(await StorjLib.deleteFile("dc2d276294df3c6447423b1f", "558eb6aa038c6a563b98a4e1"));
    }

    render() {
        return(
            <View>
            </View>
        );
    }
}