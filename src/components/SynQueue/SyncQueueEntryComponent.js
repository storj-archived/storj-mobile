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
import { getFileNameWithFixedSize } from "../../utils/fileUtils";

export default SyncQueueEntryComponent = (props) => {
    const name = getFileNameWithFixedSize(props.fileName, 25);
        
    return(
        <View style = { props.styleContainer ? styles.mainContainer2 : styles.mainContainer }>
            <View style = { styles.rowRapper }>
                <View style = { styles.rowRapperInner }>
                    <Image style = { styles.icon } source = { props.iconSource } />
                    <View style = { styles.textWrapper }>
                        <Text style = { styles.text }><Text style = { styles.textFileName }>{ name.name }</Text>{ name.extention }</Text>
                        <Text style = { [ styles.text, props.error ? styles.errorText : null ] }>{ props.status }</Text>
                    </View>
                </View>
                <TouchableOpacity onPress = { props.actionCallback }>
                    <Image style = { styles.iconRight } source = { props.actionIconSource } />
                </TouchableOpacity>
            </View>
            <View style = { props.styleContainer ? styles.progressWrapper : null }>
            {
                props.isLoading ?
                    Platform.select({
                        ios: 
                            <ProgressViewIOS 
                                progress = { props.progress }
                                trackTintColor = { '#f2f2f2' }
                                progressTintColor = { '#2794ff' } />,
                        android:
                            <ProgressBarAndroid    
                                progress = { props.progress } 
                                styleAttr = { 'Horizontal' } 
                                color = { '#2794FF' } 
                                animating = {true} 
                                indeterminate = { false } />
                    }) : null
            }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    mainContainer2: {
        flex: 1,
        marginTop: getHeight(20)
    },
    rowRapper: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    rowRapperInner: {
        flexDirection: "row",
        alignItems: "center"
    },
    icon: {
        height: getHeight(24),
        width: getWidth(20)
    },
    iconRight: {
        height: getHeight(22),
        width: getHeight(22)
    },
    textWrapper: {
        marginLeft: getWidth(10)
    },
    progressWrapper: {
        marginTop: getHeight(12)
    },
    text: {
        fontSize: getHeight(12),
        fontFamily: "montserrat_regular",
        color: "#38424b"
    },
    textFileName: {
        color: "#384B65",
        fontSize: getHeight(14),
        fontFamily: "montserrat_semibold",
    },
    errorText: {
        color: "red"
    }
});