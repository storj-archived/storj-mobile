import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight } from '../utils/adaptive';
import { TabBarActionModel } from '../models/TabBarActionModel';
import InputPopUpComponent from '../components/InputPopUpComponent';
import PropTypes from 'prop-types';

/**
 * pop up that is shown after pressing '+' button in TapBarComponent 
 */
export default class ActionBarComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newBucketName: '',
            isBucketNamePopUpShown: false
        };
    }

    shouldComponentUpdate(nextProps) {
        console.log(this.props, nextProps);
        if(this.props.tapBarActions !== nextProps.tapBarActions)
            return true;
        if(this.props.applyMargin !== nextProps.applyMargin) 
            return true;
        if(this.props.showTriangle !== nextProps.showTriangle) 
            return true;
        if(this.props.bucketScreenRouteName !== nextProps.bucketScreenRouteName)
            return true;

        return false;
    }

    deleteBuckets() {
        this.props.selectedBuckets.map(item => {
            this.props.deleteBucket(item);
        });
    }

    getTapBarAction() {
        return this.props.actions.map((action, index) => {
            var icon = action.iconPath;
            let imageWrapperStyle = index === 0 
                ? styles.imageWrapper 
                : [styles.imageWrapper, styles.imageWrapperBorder];

            return (
                <View key = { action.id } style = { imageWrapperStyle }>
                    <TouchableOpacity onPress = { action.callback }> 
                        <Image style = { styles.image } source = { action.icon } />
                    </TouchableOpacity>
                </View>
            );            
        });
    } 

    render() {
        let popUpWrapperStyle = this.props.applyMargin ? styles.popUpRectangleWrapper : styles.popUpRectangleWrapperSelectionMode;

        return(
            <View style = { [ popUpWrapperStyle ] }>
                <View style = { styles.popUpRectangle }>
                    {
                        this.getTapBarAction()
                    }
                </View>
                {
                    this.props.showTriangle ?
                        <View style = { styles.bottomTriangle }>
                            <Image 
                                source = { require('../images/ActionBar/ActionBarBottomTriangle.png') } 
                                style = { styles.triangleImage } />
                        </View> : null
                }
            </View>
        );
    };
} 

ActionBarComponent.propTypes = {
    tapBarActions: PropTypes.arrayOf(PropTypes.instanceOf(TabBarActionModel)),
    applyMargin: PropTypes.bool,
    showTriangle: PropTypes.bool,
    bucketScreenRouteName: PropTypes.string
};

const styles = StyleSheet.create({
    popUpRectangleWrapper: {
        position: 'absolute',
        bottom: getHeight(66),
        alignItems: 'center',
        left: 0, 
        right: 0
    },  
    popUpRectangleWrapperSelectionMode: {   
        position: 'absolute',
        bottom: getHeight(7),
        alignItems: 'center',
        marginHorizontal: getWidth(10)
    },  
    popUpRectangle: {
        width: getWidth(355),
        height: getHeight(51),
        borderRadius: getWidth(10),
        backgroundColor: '#2684FF',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    imageWrapper: {
        flex: 1,
        height: getHeight(50),
        paddingVertical: getHeight(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageWrapperBorder: {
        borderLeftWidth: getWidth(1),
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    image: {
        width: getHeight(30),
        height: getHeight(30)
    },
    bottomTriangle: {
        height: getHeight(12),
        alignItems: 'center'
    }
});