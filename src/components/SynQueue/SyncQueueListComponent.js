import React, { Component } from "react";
import {
    View,
    Image,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from "react-native";

export default class SyncQueueListComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { [ styles.container, this.props.containerStyle ] }>
                <View style = { styles.headerContainer }>
                    <TouchableOpacity onPress = { this.props.onCancelPress }>
                        <Image source = { require("../../images/Icons/BlueCross.png") } />
                    </TouchableOpacity>
                    <Text>{ this.props.title }</Text>
                    <TouchableOpacity onPress = { this.props.onTouchableRightPress }>
                        <Text>{ this.props.touchableRightTitle }</Text>
                    </TouchableOpacity>
                </View>
                <View style = { styles.contentContainer }>
                    <FlatList
                        data = { this.props.data }
                        renderItem = { this.props.renderItem }
                        ItemSeparatorComponent = { null }
                        ListEmptyComponent = { null } />
                </View>
            </View>
        ); 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    contentContainer: {

    }
});
