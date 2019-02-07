import React from "react";
import {
    View,
    Image,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import PropTypes from 'prop-types';
import { getWidth, getHeight } from "../../utils/adaptive";

export default SyncQueueListComponent = (props) => {

    return(
        <View style = { [ styles.container, props.containerStyle ] }>
            <View style = { styles.headerContainer }>
                <View style = { styles.row }>
                    <TouchableOpacity style = { styles.cancelWrapper } onPress = { props.onCancelPress }>
                        <Image style = { styles.icon } source = { require("../../images/Icons/BlueCross.png") } />
                    </TouchableOpacity>
                    <View style={ styles.titleWrapper }>
                        <Text numberOfLines = { 2 } style = { styles.title }>{ props.title }</Text>
                    </View>
                </View>
                <TouchableOpacity style = { styles.touchableRightWrapper } onPress = { props.onTouchableRightPress }>
                    <Text style = { styles.touchableRightText }>{ props.touchableRightTitle }</Text>
                </TouchableOpacity>
            </View>
            <View style = { styles.contentWrapper }>
                <FlatList
                    contentContainerStyle = { styles.contentContainer }
                    style = { { height: 320 } }
                    data = { props.data }
                    renderItem = { props.renderItem }
                    ItemSeparatorComponent = { () => <View style = { styles.itemSeparator } /> }
                    ListEmptyComponent = { null } />
            </View>
        </View>
    ); 
}

SyncQueueListComponent.propTypes = {
    data: PropTypes.array,
    onCancelPress: PropTypes.func,
    onTouchableRightPress: PropTypes.func,
    renderItem: PropTypes.func,
    title: PropTypes.string,
    touchableRightTitle: PropTypes.string
};

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
        fontFamily: "montserrat_bold",
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
        fontFamily: "montserrat_medium",
        fontSize: getHeight(18)
    }, 
    touchableRightWrapper: {
        backgroundColor: "transparent"
    }
});
