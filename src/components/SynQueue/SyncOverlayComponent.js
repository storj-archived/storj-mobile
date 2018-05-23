import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";

export default class SyncOverlayComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <TouchableOpacity onPress = { this.props.onPress } style = { styles.mainContainer } >
                <Text>PlaceHolder</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "red",
        height: 50
    }
});