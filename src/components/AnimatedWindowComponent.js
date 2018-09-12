import React from "react";
import {
    Animated
} from "react-native";

export default AnimatedWindowComponent = (props) => {

    return(
        <Animated.View style = { [ props.style, props.interpolate() ] }>
            { props.children }
        </Animated.View>
    );
} 
