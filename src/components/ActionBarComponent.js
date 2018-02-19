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
        if(this.props.isSelectionMode !== nextProps.isSelectionMode) 
            return true;
        if(this.props.isSingleItemSelected !== nextProps.isSingleItemSelected) 
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
        let actions = this.props.isSelectionMode || this.props.isSingleItemSelected ? this.props.selectionModeActions : this.props.tapBarActions;

        if(this.props.openedBucketId) {
            actions = this.props.openedBucketActions;
        }

        return actions.map((action, index) => {
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
        let actions = this.props.isSelectionMode ? this.props.selectionModeActions : this.props.tapBarActions;
        let isSelectionMode = this.props.isSelectionMode || this.props.isSingleItemSelected;
        let popUpWrapperStyle = isSelectionMode ? styles.popUpRectangleWrapperSelectionMode : styles.popUpRectangleWrapper;

        return(
            <View style = { [ popUpWrapperStyle ] }>
                <View style = { styles.popUpRectangle }>
                    {
                        this.getTapBarAction()
                    }
                </View>
                {
                    !this.props.isSelectionMode && !this.props.isSingleItemSelected ?
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
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    tapBarActions: PropTypes.arrayOf(PropTypes.instanceOf(TabBarActionModel)),
    selectionModeActions: PropTypes.arrayOf(PropTypes.instanceOf(TabBarActionModel)),
    openedBucketId: PropTypes.string, 
    openedBucketActions: PropTypes.array
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