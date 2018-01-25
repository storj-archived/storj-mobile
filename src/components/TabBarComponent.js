import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight } from '../utils/adaptive';

/**
* Footer component in main page 
*/
export default class TabBarComponent extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return(
            this.props.navigation.isSelectionMode ? null :
            <View style = { styles.mainContainer }>       
                <View style = { styles.navContainer }>
                    <View style = { styles.tabContainer }>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.goToBucketsScreen(); } }>
                            <View><Image source = { require('../images/TabBar/HomeTabBar.png') } style = { styles.tabItemImage }/></View>
                        </TouchableOpacity>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.test(); } }>
                            <View><Image source = { require('../images/TabBar/BucketTabBar.png') } style = { styles.tabItemImage }/></View>
                        </TouchableOpacity>
                        <View style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.onActionBarPress(); } }></View>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.goToBucketsScreen(); } }>
                            <View><Image source = { require('../images/TabBar/TrashTabBar.png') } style = { styles.tabItemImage }/></View>
                        </TouchableOpacity>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.goToBucketsScreen(); } }>
                            <View><Image source = { require('../images/TabBar/UserTabBar.png') } style = { styles.tabItemImage }/></View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = { styles.actionButtonWrapper }>
                    <TouchableOpacity onPress = { () => { this.props.navigation.onActionBarPress(); } }>
                        <View><Image source = { require('../images/TabBar/Ellipse.png') } style = { styles.circleActionbutton }/></View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    actionButtonWrapper: {
        position: 'absolute',
        top: 0, left: 0, bottom: 0, right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainContainer: {
        position: 'absolute',
        left: 0, bottom: 0, right: 0,
        backgroundColor: 'transparent',
        height: getHeight(70),
        justifyContent: 'flex-end'
    },
    navContainer: {
        bottom: 0,
        backgroundColor: 'white',
        height:  getHeight(50)
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    tabItemContainer: {
        backgroundColor: 'white',
        flex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabItemImage: {
        width: getWidth(22),
        height: getWidth(22)
    },
    circleActionbutton: {
        height: getWidth(56),
        width: getWidth(56)
    }
});