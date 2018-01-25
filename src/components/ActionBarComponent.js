import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight } from '../utils/adaptive';
import TabBarActionModel from '../models/TabBarActionModel';
import PropTypes from 'prop-types';

/**
* pop up that is shown after pressing '+' button in TapBarComponent 
*/
export default class ActionBarComponent extends Component {
    constructor(props) {
        super(props);
    };

    deleteBuckets() {
        this.props.selectedBuckets.map(item => {
            this.props.deleteBucket(item);
        });
    };

    render() {
        return(
            <View style = { this.props.isSelectionMode ? styles.popUpRectangleWrapperSelectionMode : styles.popUpRectangleWrapper }>
                <View style = { styles.popUpRectangle }>
                    {
                            this.props.tapBarActions.map((action) => {
                                var icon = action.iconPath;
                                return (
                                    <View style = { styles.imageWrapper }>
                                        <TouchableOpacity onPress={ action.callback }> 
                                            <Image style = { styles.image } source = { action.icon }/>
                                        </TouchableOpacity>
                                    </View>);            
                            })
                        }
                </View>
                <View style = { styles.bottomTriangle }>
                    <Image source = { require('../images/ActionBar/ActionBarBottomTriangle.png') } style = { styles.triangleImage }/>
                </View>
            </View>
        );
    };
} 

ActionBarComponent.PropTypes = {
    isSelectionMode: PropTypes.bool,
    tapBarActions: PropTypes.arrayOf(PropTypes.instanceOf(TabBarActionModel))
};

const styles = StyleSheet.create({
    popUpRectangleWrapper: {
        position: 'absolute',
        bottom: getHeight(62),
        alignItems: 'center',
        marginHorizontal: getWidth(10)
    },  
    popUpRectangleWrapperSelectionMode: {
        position: 'absolute',
        bottom: getHeight(7),
        alignItems: 'center',
        marginHorizontal: getWidth(10)
    },  
    popUpRectangle: {
        width: getWidth(350),
        height: getHeight(51),
        borderRadius: getWidth(10),
        backgroundColor: '#2684FF',
        flexDirection: 'row'
    },
    imageWrapper: {
        width: getWidth(117),
        height: getHeight(50),
        paddingHorizontal: getWidth(46),
        paddingVertical: getHeight(10)
    },
    image: {
        width: getHeight(30),
        height: getHeight(30)
    },
    bottomTriangle: {
        height: getHeight(12),
        width: getWidth(350),
        alignItems: 'center'
    }
});