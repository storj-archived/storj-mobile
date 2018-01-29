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
                <View style = { listItemStyles.listItemActionsIconContainer }>
                    <Image style = { listItemStyles.listItemActionsIcon } source = { require('../images/Icons/listItemActions.png') } />
                </View>
            </View>
    </TouchableOpacity>

ListItemComponent.propTypes = {
    item: PropTypes.object,
    onLongPress: PropTypes.func,
    isSelectionModeEnabled: PropTypes.bool,
    onPress: PropTypes.func    
};

const listItemStyles = StyleSheet.create({
    listItemContainer: {
        width: getWidth(375),
        height: getHeight(55),
        paddingHorizontal: getWidth(20),
        backgroundColor: 'transparent'
    },
    listItemContent: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: getHeight(1),
        borderColor: 'gray',
        alignItems: 'center'
    },
    mainTitleText: {
        fontFamily: 'Montserrat',
        lineHeight: getHeight(20),
        fontSize: getHeight(16),
        color: 'black',
        width: getWidth(271)
    },
    imageContainer: {
        width: getWidth(40)
    },
    listItemActionsIconContainer: {        
        marginRight: getWidth(10),
        alignItems: 'flex-end'
    },
    itemTypeIcon: {
        width: getWidth(25),
        height: getHeight(22)
    },
    listItemActionsIcon: {
        width: getWidth(20),
        height: getWidth(20)
    },
    selectedIcon: {
        width: getWidth(20),
        height: getWidth(20),
        marginRight: getWidth(20)
    }
});

//TODO: Add prop types