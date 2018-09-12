import React from "react";
import {
    StyleSheet,
    TouchableOpacity
} from "react-native";

export default SyncOverlayComponent = (props) => {

    return(
        <TouchableOpacity onPress = { props.onPress } style = { styles.mainContainer } >
            {
                props.children
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "transparent",
        height: 50,
        padding: 10,
        paddingTop: 0
    }
});