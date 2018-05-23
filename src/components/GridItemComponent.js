import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight } from '../utils/adaptive';
import ProgressCircleComponent from '../components/ProgressCircleComponent';
import PropTypes from 'prop-types';

export default class GridItemComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        return(
            <TouchableOpacity 
                style = { props.isSingleItemSelected ? [gridItemStyles.listItemContainer, gridItemStyles.itemSelected] : gridItemStyles.listItemContainer }
                onPress = { props.onPress }
                onLongPress = { props.onLongPress }>
                    <View style = { gridItemStyles.listItemContent }>
                        <View>
                            <Image 
                                style = { gridItemStyles.fileTypeIcon } 
                                source = { props.listItemIconSource }
                                resizeMode = 'contain' /> 
                            {
                                props.isLoading ?
                                    <View style = { gridItemStyles.progressCircle }>
                                        <ProgressCircleComponent
                                            percent = { props.progress * 100 }
                                            radius = { 17 }
                                            borderWidth = { 2 }
                                            color = "#2794FF"
                                            shadowColor = "#FFFFFF"
                                            bgColor = "#A8CEFF" >
                                            <TouchableOpacity onPress = { props.onCancelPress }>
                                                <Image 
                                                    source = { require('../images/Icons/CancelDownload.png') } 
                                                    style = { gridItemStyles.cancelDownloadImage } 
                                                    resizeMode = 'contain' /> 
                                            </TouchableOpacity>
                                        </ProgressCircleComponent>
                                    </View> 
                                    : null
                            }  
                        </View>
                        <View style = { gridItemStyles.textWrapper }>
                            {
                                this.props.children
                            }
                            {
                                !props.isListActionsDisabled || props.isSelectionMode ? 
                                    <View/>
                                    : <TouchableOpacity 
                                        style = { gridItemStyles.listItemActionsIconContainer } 
                                        onPress = { props.onDotsPress }>
                                        <Image style = { gridItemStyles.listItemActionsIcon } source = { require('../images/Icons/listItemActions.png') } />
                                    </TouchableOpacity> 
                            }
                        </View>
                        {
                            props.isSelectionMode ? <SelectionCheckboxComponent isSelected = { props.isSelected } /> 
                                                    : null 
                        }
                    </View>
            </TouchableOpacity>
        );
    }
}

const SelectionCheckboxComponent = (props) => (
    props.isSelected ? <Image style = { gridItemStyles.selectedIcon } source = { require('../images/Icons/GridItemSelected.png') } /> 
                                                    : <Image style = { gridItemStyles.selectedIcon } source = { require('../images/Icons/GridItemUnselected.png') } />
);

/* GridItemComponent.propTypes = {
    itemType: PropTypes.string,
    item: PropTypes.object,
    onLongPress: PropTypes.func,
    isSelectionModeEnabled: PropTypes.bool,
    isSelectDisabled: PropTypes.bool,
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

const gridItemStyles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
        height: getHeight(130),
        width: getWidth(111)
    },
    itemSelected: {
        backgroundColor: '#d4e6ff',
        borderRadius: getHeight(6)
    },
    listItemContent: {
        flex: 1,
        alignItems: 'center'
    },
    textWrapper: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainTitleText: {
        fontFamily: 'Montserrat-Regular',
        lineHeight: getHeight(14),
        fontSize: getHeight(12),
        color: '#384B65'
    },
    extentionText: {
        fontFamily: 'Montserrat-Regular',
        lineHeight: getHeight(14),
        fontSize: getHeight(12),
        color: 'rgba(56, 75, 101, 0.4)'
    },
    listItemActionsIconContainer: {        
        alignItems: 'center',
        justifyContent: 'center'
    },
    bucketTypeIcon: {
        width: getWidth(70),
        height: getHeight(64)
    },
    fileTypeIcon: {
        width: getWidth(58),
        height: getHeight(70)
    },
    listItemActionsIcon: {
        width: getWidth(20),
        height: getWidth(20)
    },
    selectedIcon: {
        position: 'absolute',
        top: getHeight(11),
        left: getWidth(16),
        width: getWidth(22),
        height: getWidth(22),
        backgroundColor: 'transparent'
    },
    textMargin: {
        alignItems: 'center',
        marginTop: getHeight(5)
    },
    progressCircle: {
        position: 'absolute',
        top: getHeight(15),
        alignSelf: 'center'
    },
    cancelDownloadImage: { 
        height: getHeight(24), 
        width: getWidth(24) 
    }
});