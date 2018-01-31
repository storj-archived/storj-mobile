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
        style = { props.isItemActionsSelected ? [listItemStyles.listItemContainer, listItemStyles.itemSelected] : listItemStyles.listItemContainer }
        onPress = { () => {
            if(props.isSingleItemSelected) {
                props.onSingleItemSelected();
                props.selectItemId(null);
                return;
            }
            props.onPress(props.item); 
        }}
        onLongPress = { () => { 
            if(!props.isSingleItemSelected) {
                props.onLongPress(props.item);
            }
        }}>
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
            <TouchableOpacity 
                style = { listItemStyles.listItemActionsIconContainer } 
                onPress = { () => {                     
                    !props.isSingleItemSelected 
                        ? props.selectItemId(props.item.entity.id) 
                        : props.selectItemId(null);
                    
                    props.onSingleItemSelected();
                }}>
                <Image style = { listItemStyles.listItemActionsIcon } source = { require('../images/Icons/listItemActions.png') } />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>

ListItemComponent.propTypes = {
    item: PropTypes.object,
    onLongPress: PropTypes.func,
    isSelectionModeEnabled: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    isItemActionsSelected: PropTypes.bool,
    selectItemId: PropTypes.func,
    onPress: PropTypes.func    
};

const listItemStyles = StyleSheet.create({
    listItemContainer: {
        width: getWidth(335),
        height: getHeight(55),
        backgroundColor: 'transparent'
    },
    itemSelected: {
        backgroundColor: '#d4e6ff',
        borderRadius: getHeight(6)
    },
    listItemContent: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: getHeight(0.8),
        borderColor: '#c6c6c6',
        alignItems: 'center'
    },
    mainTitleText: {
        fontFamily: 'Montserrat',
        lineHeight: getHeight(20),
        fontSize: getHeight(16),
        color: 'black',
        width: getWidth(241)
    },
    imageContainer: {
        width: getWidth(40)
    },
    listItemActionsIconContainer: {        
        height: getHeight(55),
        width: getWidth(50),
        alignItems: 'flex-end',
        justifyContent: 'center'
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