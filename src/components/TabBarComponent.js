import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';

export default class TabBarComponent extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.navContainer }>
                    <View style = { styles.tabContainer }>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.goToBucketsScreen(); } }>
                            <View><Text>Item 1</Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.test(); } }>
                            <View><Text>Item 2</Text></View>
                        </TouchableOpacity>
                        <View style = { styles.tabItemContainer }><Text>Action ButtonSpace</Text></View>
                        <View style = { styles.tabItemContainer }><Text>Item 3</Text></View>
                        <View style = { styles.tabItemContainer }><Text>Item 4</Text></View>   
                    </View>
                </View>
                <View style = { styles.actionButtonBackgroundWrapper }>
                    <TouchableOpacity onPress = { this.props.navigation.onActionBarPress } style = { styles.circleActionbutton }>
                        <View />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'transparent',
        height: 60,
        borderColor: 'black',
        borderWidth: 0.5,
        justifyContent: 'flex-end'
    },
    navContainer: {
        backgroundColor: 'green',
        height: 50
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    tabItemContainer: {
        borderWidth: 1,
        borderColor: 'black',
        flex: 0.15
    },
    actionButtonContainer: {

    },
    actionButtonBackgroundWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleActionbutton: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: 'blue'
    }
});