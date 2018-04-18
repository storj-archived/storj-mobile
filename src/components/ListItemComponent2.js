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
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getWidth, getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';

export default class ListItemComponent2 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;

        return(
            <TouchableOpacity 
                style = { props.isSingleItemSelected ? [listItemStyles.listItemContainer, listItemStyles.itemSelected] : listItemStyles.listItemContainer }
                onPress = { props.onPress }
                onLongPress = { props.onLongPress }>
                    <View style = { listItemStyles.listItemContent }>
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
                                this.props.children
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
                            !props.isSelectionMode ? 
                                <RightIconComponent 
                                    onPress = { props.isLoading ? props.onCancelPress : props.onDotsPress } 
                                    iconSource = { props.isLoading ? require('../images/Icons/CancelDownload.png') : require('../images/Icons/listItemActions.png') } /> 
                                : null
                        }
                    </View>
            </TouchableOpacity>
        );
    }
}

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

//TODO: add comments for all this stuff
/* ListItemComponent2.propTypes = {
    item: PropTypes.object,
    onLongPress: PropTypes.func,
    isSelectionModeEnabled: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    isItemActionsSelected: PropTypes.bool,
    selectItemId: PropTypes.func,
    onPress: PropTypes.func,
    progress: PropTypes.number,
    listItemIcon: PropTypes.number, 
    isFileLoading: PropTypes.bool,
    isSelected: PropTypes.bool,
    disableSelectionMode: PropTypes.func,
    onSingleItemSelected: PropTypes.func
}; */

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
        marginHorizontal: getWidth(10),
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
    },
    cancelDownloadImage: { 
        height: getHeight(24), 
        width: getWidth(24) 
    },
    extentionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16),
        color: 'rgba(56, 75, 101, 0.4)'
    },
    fileSizeText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(12),
        color: 'rgba(56, 75, 101, 0.4)'
    }
});