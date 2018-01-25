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
                        <View>
                            <Image source = { require('../images/ActionBar/Ellipse.png') } style = { styles.circleImage }/>
                            <Text style = { styles.circleText }>+</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'transparent',
        height: getHeight(65),
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
        backgroundColor: 'transparent'
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
        height: getWidth(56),
        width: getWidth(56)
    },
    circleImage: {
        height: getWidth(56),
        width: getWidth(56)
    },
    circleText: {
        color: 'white',
        fontSize: getHeight(32),
        marginHorizontal: getWidth(20),
        zIndex: 100,
        position: 'absolute',
    }
});