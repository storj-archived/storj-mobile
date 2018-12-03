import {
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import { getWidth, getHeight } from '../utils/adaptive';

export default Button = (props) => (
    <TouchableOpacity onPress = { props.onPress } style = { styles.container }>
        <Image source = { props.source } style = { styles.image } resizeMode = "contain"/>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        width: getWidth(50), 
        height: getHeight(50), 
        alignItems: "center", 
        justifyContent: "center"
    },
    image: {
        width: getWidth(24), 
        height: getHeight(24)
    }
});