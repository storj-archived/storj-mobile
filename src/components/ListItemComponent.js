import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import { getWidth, getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';

export default ListItemComponent = (props) => 
    <TouchableOpacity 
        style = { listItemStyles.listItemContainer }
        onPress = { () => { props.onPress(props.item); } }
        onLongPress = { () => { props.onLongPress(props.item); } }>
            <View style = { listItemStyles.listItemContent }>
                {
                    (() => {
                        if(props.isSelectionModeEnabled) {
                            if(props.item.isSelected) {
                                return(<Image style = { listItemStyles.selectedIcon } source = { require('../images/Icons/ListItemSelected.png') } />);    
                            } else {
                                return(<Image style = { listItemStyles.selectedIcon } source = { require('../images/Icons/ListItemUnselected.png') } />);
                            }
                        }
                    })()
                }
                <View style = { listItemStyles.imageContainer }>
                    <Image style = { listItemStyles.itemTypeIcon } source = { require('../images/Icons/BucketItemFolder.png') } />
                </View>
                <Text style = { listItemStyles.mainTitleText }>{ props.item.getName() }</Text>
            </View>
    </TouchableOpacity>

ListItemComponent.PropTypes = {
    item: PropTypes.object,
    onLongPress: PropTypes.func,
    isSelectionModeEnabled: PropTypes.bool,
    onPress: PropTypes.func    
};

const listItemStyles = StyleSheet.create({
    listItemContainer: {
        width: getWidth(375),
        height: getHeight(55),
        paddingHorizontal: getWidth(20)
    },
    listItemContent: {
        flex: 1,
        flexDirection: 'row',
        borderTopWidth: getHeight(1),
        borderColor: 'gray',
        alignItems: 'center'
    },
    mainTitleText: {
        fontFamily: 'Montserrat',
        lineHeight: getHeight(20),
        fontSize: getHeight(16),
        color: 'black'
    },
    imageContainer: {
        width: getWidth(40)
    },
    itemTypeIcon: {
        width: getWidth(25),
        height: getHeight(22)
    },
    selectedIcon: {
        width: getWidth(20),
        height: getWidth(20),
        marginRight: getWidth(20)
    }
});