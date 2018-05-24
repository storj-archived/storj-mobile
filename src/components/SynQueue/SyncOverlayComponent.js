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
                {
                    this.props.children
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "transparent",
        height: 50,
        padding: 10,
        paddingTop: 0
    }
});