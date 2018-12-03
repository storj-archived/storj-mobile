import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    ProgressViewIOS,
    ProgressBarAndroid
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';

export default class ListItemComponent extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        var isSelectedChanged = this.props.isSelected !== nextProps.isSelected;
        var isProgressChanged = this.props.progress !== nextProps.progress;        
        var isSelectionModeChanged = this.props.isSelectionMode !== nextProps.isSelectionMode;
        var isSingleItemSelectedChanged = this.props.isSingleItemSelected !== nextProps.isSingleItemSelected;
        var isStarredChanged = this.props.isStarred !== nextProps.isStarred;

        return isSelectedChanged || isProgressChanged || isSelectionModeChanged || isSingleItemSelectedChanged || isStarredChanged;
    }

    render() {
        var props = this.props;
        return ( 
        <TouchableOpacity 
            style = { props.isSingleItemSelected ? [listItemStyles.listItemContainer, listItemStyles.itemSelected] : listItemStyles.listItemContainer }
            onPress = { props.onPress }
            onLongPress = { props.onLongPress }>
            <View style = { props.isExpanderDisabled ? [listItemStyles.listItemContent, listItemStyles.justifyStart] : listItemStyles.listItemContent }>
                {
                    props.isSelectionMode ? <SelectionCheckboxComponent isSelected = { props.isSelected } /> 
                                            : null   
                }
                <View>
                    <Image 
                        style = { listItemStyles.itemTypeIcon } 
                        source = { props.listItemIconSource }
                        resizeMode = 'contain' />
                </View>
                <View style = { listItemStyles.textWrapper }>
                    { 
                        props.children
                    }
                    {
                        props.isLoading ? 
                            Platform.select({
                                ios: 
                                    <ProgressViewIOS 
                                        progress = { props.progress }
                                        trackTintColor = { '#f2f2f2' }
                                        progressTintColor = { '#2794ff' } />,
                                android:
                                    <ProgressBarAndroid    
                                        progress = { props.progress } 
                                        styleAttr = { 'Horizontal' } 
                                        color = { '#2794FF' } 
                                        animating = {true} 
                                        indeterminate = { false } />
                            })
                            : props.size ? <Text style = { listItemStyles.fileSizeText }>{ props.size }</Text> 
                                            : null
                    }
                </View>
                {
                    props.isListActionsDisabled || (props.isSelectionMode && props.isExpanderDisabled) ? 
                        <View/>
                        : <RightIconComponent 
                            onPress = { props.isLoading ? props.onCancelPress : props.onDotsPress } 
                            iconSource = { props.isLoading ? require('../images/Icons/CancelDownload.png') : require('../images/Icons/listItemActions.png') } /> 
                        
                }
            </View>
    </TouchableOpacity>);
    }
}

ListItemComponent.propTypes = {
    children: PropTypes.object,
    isLoading: PropTypes.bool,
    isSelected: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    listItemIconSource: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    onCancelPress: PropTypes.func,
    onDotsPress: PropTypes.func,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
    progress: PropTypes.number,
    isExpanderDisabled: PropTypes.bool,
    isListActionsDisabled: PropTypes.bool,
    size: PropTypes.string
};

const SelectionCheckboxComponent = (props) => (
    props.isSelected ? <Image style = { listItemStyles.selectedIcon } source = { require('../images/Icons/ListItemSelected.png') } /> 
                                                    : <Image style = { listItemStyles.selectedIcon } source = { require('../images/Icons/ListItemUnselected.png') } />
);

const RightIconComponent = (props) => (
    <TouchableOpacity 
        style = { listItemStyles.listItemActionsIconContainer } 
        onPress = { props.onPress }>
            <Image 
                source = { props.iconSource } 
                style = { listItemStyles.cancelDownloadImage } 
                resizeMode = 'contain' />

    </TouchableOpacity>
);

const listItemStyles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
        height: getHeight(55)
    },
    itemSelected: {
        backgroundColor: '#d4e6ff',
        borderRadius: getHeight(6)
    },
    listItemContent: {
        flex: 1,
        marginLeft: getWidth(10),
        marginRight: getWidth(0),
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        borderColor: 'rgba(56, 75, 101, 0.2)',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    justifyStart: {
        justifyContent: 'flex-start'
    },
    textWrapper: {
        flex: 0.9
    },
    listItemActionsIconContainer: {        
        height: getHeight(55),
        width: getWidth(55),
        alignItems: 'center',
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
    },
    cancelDownloadImage: { 
        height: getHeight(24), 
        width: getWidth(24) 
    },
    fileSizeText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(12),
        color: 'rgba(56, 75, 101, 0.4)'
    }
});