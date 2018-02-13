import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    ProgressViewIOS,
    ProgressBarAndroid
} from 'react-native';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getWidth, getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';

export default class ListItemComponent extends Component {
    constructor(props) {
        super(props);
        this.bucket = null;
        //console.log(props);
    }

    shouldComponentUpdate(nextProps) {
        if( this.props.item !== nextProps.item ||
            this.props.isSelectionModeEnabled !== nextProps.isSelectionModeEnabled ||
            this.props.isSelected !== nextProps.isSelected ||
            this.props.isItemActionsSelected !== nextProps.isItemActionsSelected ||
            this.props.isSingleItemSelected !== nextProps.isSingleItemSelected) 
                return true;
        
        //TODO: Optimize render performance
        return false;
    }

    deselectAllItems() {
        this.props.selectItemId(null);
        this.props.disableSelectionMode();
    }

    render() {
        let name = this.props.item ? this.props.item.getName() : "name";
        let isSelected = this.props.item ? this.props.item.isSelected: false;
        let props = this.props;

        return(
            <TouchableOpacity 
                style = { props.isItemActionsSelected ? [listItemStyles.listItemContainer, listItemStyles.itemSelected] : listItemStyles.listItemContainer }
                onPress = { () => {
                    if(props.isSingleItemSelected) {
                        this.deselectAllItems()
                    } else if(props.isSelectionModeEnabled) {
                        props.onSelectionPress(props.item); 
                    } else {
                        this.props.onPress({ bucketId: this.props.item.getId() });
                    }
                }}
                onLongPress = { () => { 
                    props.onLongPress(props.item);
                }}>
                    <View style = { listItemStyles.listItemContent }>
                        {
                            (() => {
                                if(props.isSelectionModeEnabled) {
                                    if(isSelected) {
                                        return(<Image style = { listItemStyles.selectedIcon } source = { require('../images/Icons/ListItemSelected.png') } />);    
                                    } else {
                                        return(<Image style = { listItemStyles.selectedIcon } source = { require('../images/Icons/ListItemUnselected.png') } />);
                                    }
                                }
                            })()
                        }
                        <View>
                            <Image style = { listItemStyles.itemTypeIcon } source = { props.listItemIcon } />
                        </View>
                        <View style = { listItemStyles.textWrapper }>
                            <Text numberOfLines = {1} style = { listItemStyles.mainTitleText }>{ props.item.getName() }</Text>
                            {
                                this.props.progress ? 
                                    Platform.select({
                                        ios: 
                                            <ProgressViewIOS 
                                                progress = { 0 }
                                                trackTintColor = { '#f2f2f2' }
                                                progressTintColor = { '#2794ff' } />,
                                        android:
                                            <ProgressBarAndroid    
                                                progress = { 0 } 
                                                styleAttr = { 'Horizontal' } 
                                                color = { '#2794FF' } 
                                                animating = {true} 
                                                indeterminate = { false } />
                                    }) : null
                            }
                        </View>
                        {
                            !props.isSelectionModeEnabled ? 
                                <TouchableOpacity 
                                    style = { listItemStyles.listItemActionsIconContainer } 
                                    onPress = { () => {                     
                                        if(props.isSingleItemSelected) {
                                            props.selectItemId(null);
                                            this.deselectAllItems()
                                        } else {
                                            props.onSingleItemSelected();
                                            props.selectItemId(props.item.getId());
                                            //props.onPress(props.item);
                                        }
                                    }}>
                                    <Image style = { listItemStyles.listItemActionsIcon } source = { require('../images/Icons/listItemActions.png') } />
                                </TouchableOpacity> : null
                        }
                    </View>
            </TouchableOpacity>
        );
    }
}   

//TODO: add comments for all this stuff
ListItemComponent.propTypes = {
    item: PropTypes.object,
    onLongPress: PropTypes.func,
    isSelectionModeEnabled: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    isItemActionsSelected: PropTypes.bool,
    selectItemId: PropTypes.func,
    onPress: PropTypes.func,
    progress: PropTypes.number,
    listItemIcon: PropTypes.number, //wtf?
    isFileLoading: PropTypes.bool,
    isSelected: PropTypes.bool,
    disableSelectionMode: PropTypes.func,
    onSingleItemSelected: PropTypes.func
};

const listItemStyles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
        height: getHeight(55),
        paddingHorizontal: getWidth(10)
    },
    itemSelected: {
        backgroundColor: '#d4e6ff',
        borderRadius: getHeight(6)
    },
    listItemContent: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: 'rgba(56, 75, 101, 0.4)',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textWrapper: {
        flex: 0.9
    },
    mainTitleText: {
        fontFamily: 'Montserrat-Regular',
        lineHeight: getHeight(20),
        fontSize: getHeight(16),
        color: '#384B65'
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
        height: getWidth(20)
    }
});