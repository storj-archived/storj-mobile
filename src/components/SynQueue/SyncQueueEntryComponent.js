import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    ProgressViewIOS,
    ProgressBarAndroid
} from "react-native";
import { getHeight, getWidth } from "../../utils/adaptive";

export default class SyncQueueEntryComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.rowRapper }>
                    <View style = { styles.rowRapperInner }>
                        <Image style = { styles.icon } source = { this.props.iconSource } />
                        <View>
                            <Text>{ this.props.fileName }</Text>
                            <Text>{ this.props.status }</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress = { this.props.actionCallback }>
                        <Image style = { styles.icon } source = { this.props.actionIconSource } />
                    </TouchableOpacity>
                </View>
                {
                    this.props.isLoading ?
                        Platform.select({
                            ios: 
                                <ProgressViewIOS 
                                    progress = { this.props.progress }
                                    trackTintColor = { '#f2f2f2' }
                                    progressTintColor = { '#2794ff' } />,
                            android:
                                <ProgressBarAndroid    
                                    progress = { this.props.progress } 
                                    styleAttr = { 'Horizontal' } 
                                    color = { '#2794FF' } 
                                    animating = {true} 
                                    indeterminate = { false } />
                        }) : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    rowRapper: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    rowRapperInner: {
        flexDirection: "row"
    },
    icon: {
        height: getHeight(40),
        width: getWidth(40)
    }
});