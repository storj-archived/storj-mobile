import React, { Component } from "react";
import {
    View,
    Image,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { getWidth, getHeight } from "../../utils/adaptive";

export default class SyncQueueListComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { [ styles.container, this.props.containerStyle ] }>
                <View style = { styles.headerContainer }>
                    <View style = { styles.row }>
                        <TouchableOpacity style = { styles.cancelWrapper } onPress = { this.props.onCancelPress }>
                            <Image style = { styles.icon } source = { require("../../images/Icons/BlueCross.png") } />
                        </TouchableOpacity>
                        <View style={ styles.titleWrapper }>
                            <Text numberOfLines = { 2 } style = { styles.title }>{ this.props.title }</Text>
                        </View>
                    </View>
                    <TouchableOpacity style = { styles.touchableRightWrapper } onPress = { this.props.onTouchableRightPress }>
                        <Text style = { styles.touchableRightText }>{ this.props.touchableRightTitle }</Text>
                    </TouchableOpacity>
                </View>
                <View style = { styles.contentWrapper }>
                    <FlatList
                        contentContainerStyle = { styles.contentContainer }
                        style = { { height: 320 } }
                        data = { this.props.data }
                        renderItem = { this.props.renderItem }
                        ItemSeparatorComponent = { () => <View style = { styles.itemSeparator } /> }
                        ListEmptyComponent = { null } />
                </View>
            </View>
        ); 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: getWidth(20),
        paddingRight: getWidth(10),
        backgroundColor: "white"
    },
    headerContainer: {
        paddingTop: getHeight(5),
        paddingBottom: getHeight(10),
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "transparent"
    },
    contentWrapper: {
    },
    contentContainer: {
        paddingVertical: getHeight(5),
    },
    row: {
        flexDirection: "row" 
    },
    itemSeparator: {
        height: getHeight(2),
        backgroundColor: "#F2F2F2"
    },
    icon: {
        width: getHeight(20),
        height: getHeight(20)
    },
    titleWrapper: {
        backgroundColor: "transparent"
    },
    title: {
        color: "#384B65",
        fontFamily: "Montserrat-Bold",
        fontSize: getHeight(30),
        width: getWidth(169)
    },
    cancelWrapper: {
        paddingRight: getWidth(15),
        paddingTop: getHeight(10),
        backgroundColor: "transparent",
        alignItems: "center"
    },
    touchableRightText: {
        color: "#2794FF",
        fontFamily: "Montserrat-Medium",
        fontSize: getHeight(18)
    }, 
    touchableRightWrapper: {
        backgroundColor: "transparent"
    }
});
