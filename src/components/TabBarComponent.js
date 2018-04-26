import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Animated,
    Easing
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight, getDeviceWidth} from '../utils/adaptive';
import { getPicturesBucketId } from '../reducers/mainContainer/mainReducerActions';
import PropTypes from 'prop-types';
import ServiceModule from '../utils/ServiceModule';

/**
* Footer component in main page 
*/
export default class TabBarComponent extends Component {
    constructor(props) {
        super(props);

        this.tabBarPositionAnimated = new Animated.Value(0);
    }

    componentWillMount () {
        if(this.props.screenProps.isFirstSignIn) {
            this.hideTabBar();
        }

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.hideTabBar.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.showTabBar.bind(this));
    }

    componentDidUpdate() {
        if(this.props.navigation.state.index === 3) return;

        if(!this.props.screenProps.isFirstSignIn) {
            this.showTabBar();
        }
    }
    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    showTabBar() {
        Animated.timing(this.tabBarPositionAnimated, {
            toValue: 0,
            easing: Easing.circle,
            duration: 600,
            useNativeDriver: true
        }).start();
    }

    hideTabBar() {
        Animated.timing(this.tabBarPositionAnimated, {
            toValue: 1,
            easing: Easing.circle,
            duration: 100,
            useNativeDriver: true
        }).start();
    }

    shouldComponentUpdate(nextProps) {
        if(this.props.navigation.isSelectionMode !== nextProps.navigation.isSelectionMode 
           || this.props.navigation.isActionBarShown !== nextProps.navigation.isActionBarShown) {
            return true;
        } 

        if(this.props.currentRouteIndex !== nextProps.navigation.currentRouteIndex) {
            return true;
        }

        return false;
    }

    getTabBarTrasformProperties() {
        return {
            transform: [
                { 
                    translateY: this.tabBarPositionAnimated.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 70]
                    })
                }
            ]
        };
    }

    render() {
        let navIndex = this.props.navigationState.index;
        let actionButtonSource = !this.props.navigation.isActionBarShown 
                                    ? require('../images/TabBar/Ellipse.png')
                                    : require('../images/TabBar/EllipseCancel.png');
        let styleIcon = styles.tabItemImage;
        let styleIconSelected = [styles.tabItemImage, styles.tabItemImageSelected];

        return(
            this.props.navigation.isSelectionMode || this.props.navigation.isSingleItemSelected ? null :
            <Animated.View style = { [ styles.mainContainer, this.getTabBarTrasformProperties() ] }>       
                <View style = { styles.navContainer }>
                    <View style = { styles.tabContainer }>
                        <TouchableOpacity 
                            style = { styles.tabItemContainer } 
                            onPress = { () => {                                
                                this.props.navigation.navigate("DashboardScreen");                                
                            } }>
                            <View><Image source = { require('../images/TabBar/HomeTabBar.png') } style = { navIndex === 0 ? styleIconSelected : styleIcon }/></View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style = { styles.tabItemContainer } 
                            onPress = { () => {  
                                this.props.navigation.navigate("BucketsScreen");                                
                            } }>
                            <View><Image source = { require('../images/TabBar/BucketTabBar.png') } style = { navIndex === 1 ? styleIconSelected : styleIcon }/></View>
                        </TouchableOpacity>
                        <View style = { styles.tabItemContainer } ></View>
                        <TouchableOpacity 
                            style = { styles.tabItemContainer } 
                            onPress = { () => { 
                                let picturesBucketId = getPicturesBucketId(this.props.navigation.buckets);

                                if(!picturesBucketId) return;
                                ServiceModule.getFiles(picturesBucketId);   
                                this.props.navigation.pushLoading(picturesBucketId);
                                this.props.navigation.setPhotosBucketId(picturesBucketId);                     
                                this.props.navigation.navigate("MyPhotosScreen");
                            } }>
                            <View><Image source = { require('../images/TabBar/MyPhotos.png') } style = { navIndex === 2 ? styleIconSelected : styleIcon }/></View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style = { styles.tabItemContainer } 
                            onPress = { () => {                                                            
                                this.props.navigation.hideActionBar();                                
                                this.props.navigation.navigate("MyAccountScreen");
                            } }>
                            <View><Image source = { require('../images/TabBar/UserTabBar.png') } style = { navIndex === 3 ? styleIconSelected : styleIcon }/></View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = { styles.actionButtonWrapper }>
                    <TouchableOpacity onPress = { () => { this.props.navigation.onActionBarPress(); } }>
                        <View>
                            <Image 
                                source = { actionButtonSource } 
                                style = { styles.circleActionbutton }
                                resizeMode = { 'contain' } />
                        </View>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    actionButtonWrapper: {
        position: 'absolute',
        bottom: getHeight(5), 
        alignSelf: 'center'
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
        backgroundColor: 'transparent',
        opacity: 0.75,
        height:  getHeight(50),
        borderTopColor: 'gray',
        borderTopWidth: 0
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    tabItemContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        flex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabItemImage: {
        width: getWidth(26),
        height: getWidth(26),
        opacity: 0.5
    },
    tabItemImageSelected: {
        opacity: 1
    },
    circleActionbutton: {
        height: getWidth(56),
        width: getWidth(56)
    }
});

TabBarComponent.propTypes = {
    animationEnabled: PropTypes.bool,
    getLabel: PropTypes.func,
    getOnPress: PropTypes.func,
    getTestIDProps: PropTypes.func,
    jumpToIndex: PropTypes.func,
    layout: PropTypes.object,
    navigation: PropTypes.object,
    navigationState: PropTypes.object,
    offsetX: PropTypes.object,
    panX: PropTypes.object,
    position: PropTypes.object,
    renderIcon: PropTypes.func,
    screenProps: PropTypes.object,
    tabBarPosition: PropTypes.string,
    useNativeDriver: PropTypes.bool
}; 