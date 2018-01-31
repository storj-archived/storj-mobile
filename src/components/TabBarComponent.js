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
        let navIndex = this.props.navigationState.index;
        let actionButtonSource = !this.props.navigation.isActionBarShown 
                                    ? require('../images/TabBar/Ellipse.png')
                                    : require('../images/TabBar/EllipseCancel.png');
        let styleIcon = styles.tabItemImage;
        let styleIconSelected = [styles.tabItemImage, styles.tabItemImageSelected];

        return(
            this.props.navigation.isSelectionMode || this.props.navigation.isSingleItemSelected ? null :
            <View style = { styles.mainContainer }>       
                <View style = { styles.navContainer }>
                    <View style = { styles.tabContainer }>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.goToBucketsScreen(); } }>
                            <View><Image source = { require('../images/TabBar/HomeTabBar.png') } style = { navIndex === 0 ? styleIconSelected : styleIcon }/></View>
                        </TouchableOpacity>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.test(); } }>
                            <View><Image source = { require('../images/TabBar/BucketTabBar.png') } style = { navIndex === 1 ? styleIconSelected : styleIcon }/></View>
                        </TouchableOpacity>
                        <View style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.onActionBarPress(); } }></View>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.goToBucketsScreen(); } }>
                            <View><Image source = { require('../images/TabBar/TrashTabBar.png') } style = { navIndex === 2 ? styleIconSelected : styleIcon }/></View>
                        </TouchableOpacity>
                        <TouchableOpacity style = { styles.tabItemContainer } onPress = { () => { this.props.navigation.goToBucketsScreen(); } }>
                            <View><Image source = { require('../images/TabBar/UserTabBar.png') } style = { navIndex === 3 ? styleIconSelected : styleIcon }/></View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = { styles.actionButtonWrapper }>
                    <TouchableOpacity onPress = { () => { this.props.navigation.onActionBarPress(); } }>
                        <View>
                            <Image 
                                source = { actionButtonSource } 
                                style = { styles.circleActionbutton } />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>);
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
        height:  getHeight(50),
        borderTopColor: 'gray',
        borderTopWidth: 1
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
        width: getWidth(26),
        height: getWidth(26)
    },
    tabItemImageSelected: {
        opacity: 0.5
    },
    circleActionbutton: {
        height: getWidth(56),
        width: getWidth(56)
    }
});

//TODO: add prop types