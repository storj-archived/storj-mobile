import React, { Component } from "react";
import {
    Animated
} from "react-native";

export default class AnimatedWindowComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Animated.View style = { [ this.props.style, this.props.interpolate() ] }>
                { this.props.children }
            </Animated.View>
        );
    }
} 
