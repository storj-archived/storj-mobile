import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform
} from 'react-native';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getWidth, getHeight } from '../utils/adaptive';
import { TYPES } from '../utils/constants/typesConstants';
import ProgressCircleComponent from '../components/ProgressCircleComponent';
import PropTypes from 'prop-types';

export default class GridItemComponent extends Component {
    constructor(props) {
        super(props);

        this.bucket = null;
        this.item = this.props.item;
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.item !== nextProps.item ||
            this.props.isSelectionModeEnabled !== nextProps.isSelectionModeEnabled ||
            this.props.isSelected !== nextProps.isSelected ||
            this.props.isItemActionsSelected !== nextProps.isItemActionsSelected ||
            this.props.isSingleItemSelected !== nextProps.isSingleItemSelected ||
            this.props.progress !== nextProps.progress ||
            this.props.isLoading !== nextProps.isLoading ||
            this.props.isStarred !== nextProps.isStarred) 
                return true;
        
        //TODO: Optimize render performance
        return false;
    }

    deselectAllItems() {
        this.props.selectItemId(null);
        this.props.disableSelectionMode();
    }

    renderItemName() {
        switch(this.props.itemType) {
            case TYPES.REGULAR_BUCKET: {
                const name = this.props.item.getName();

                if(name.length > 13) {
                    let firstRowName = name.slice(0,10) + '...';

                    return(
                        <View style = { gridItemStyles.textMargin }>
                            <Text style = { gridItemStyles.mainTitleText }>{ firstRowName }</Text> 
                        </View>
                    )
                }; 

                return(
                    <Text numberOfLines = {1} style = { [gridItemStyles.mainTitleText, gridItemStyles.textMargin] }>{ name }</Text> 
                ); 
            } 
                
            break;
            case TYPES.REGULAR_FILE: {
                const fullName = this.props.item.getName();
                const dotIndex = fullName.lastIndexOf('.');
                const name = fullName.slice(0, dotIndex);
                const extention = fullName.slice(dotIndex);

                if(fullName.length > 13){

                    if(name.length > 7) {
                        name = name.slice(0,5) + '..';
                    }

                    if(extention.length > 6) {
                        extention = '.' +  extention.slice(extention.length - 5, extention.length - 1);
                    }

                    return(
                        <View style = { gridItemStyles.textMargin }>
                            <Text style = { gridItemStyles.mainTitleText }>{ name }
                                <Text style = { gridItemStyles.extentionText }>{ extention }</Text>
                            </Text> 
                        </View>
                    )
                }

                return(
                    <Text numberOfLines = {1} style = { [gridItemStyles.mainTitleText, gridItemStyles.textMargin] }>{ name }
                        <Text style = { gridItemStyles.extentionText }>{ extention }</Text>
                    </Text> 
            )};
            break;
            default: return(
                <Text numberOfLines = {1} style = { [gridItemStyles.mainTitleText, gridItemStyles.textMargin] }>{ this.props.item.getName() }</Text> 
            ); 
        }
    }

    render() {
        let isSelected = this.props.item ? this.props.item.isSelected: false;
        let props = this.props;

        return(
            <TouchableOpacity 
                style = { props.isItemActionsSelected ? [gridItemStyles.listItemContainer, gridItemStyles.itemSelected] : gridItemStyles.listItemContainer }
                onPress = { () => {
                    if(props.isSingleItemSelected) {
                        this.deselectAllItems();
                        return;
                    }

                    if(props.isSelectionModeEnabled) {                                             
                        props.onSelectionPress(props.item); 
                        return;
                    }
                    
                    this.props.onPress({ bucketId: props.item.getId() });
                }}
                onLongPress = { () => {
                    props.onLongPress(props.item);
                }}>
                    <View style = { gridItemStyles.listItemContent }>
                        <View>
                            <Image 
                                style = { props.bucketId ? gridItemStyles.fileTypeIcon : gridItemStyles.bucketTypeIcon } 
                                source = { props.isStarred ? props.starredGridItemIcon : props.listItemIcon }
                                resizeMode = 'contain' />
                            {
                                props.bucketId && props.item.isLoading ?
                                    <View style = { gridItemStyles.progressCircle }>
                                        <ProgressCircleComponent
                                            percent = { props.item.progress * 100 }
                                            radius = { 17 }
                                            borderWidth = { 2 }
                                            color = "#2794FF"
                                            shadowColor = "#FFFFFF"
                                            bgColor = "#A8CEFF" >
                                            <TouchableOpacity onPress = {() => {
                                                if(props.cancelDownload && props.item.isLoading) {
                                                    props.item.hmac
                                                        ? props.cancelDownload(props.item)
                                                        : props.cancelUpload(props.item); 
                                                }
                                            }}>
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
                                this.renderItemName()
                            }
                            {
                                !props.isSelectionModeEnabled ? 
                                    <TouchableOpacity 
                                        style = { gridItemStyles.listItemActionsIconContainer } 
                                        onPress = { () => {                     
                                            if(props.isSingleItemSelected) {
                                                props.selectItemId(null);
                                                this.deselectAllItems()
                                            } else {
                                                props.onSingleItemSelected();
                                                props.onSelectionPress(props.item);
                                                props.selectItemId(props.item.getId());
                                            }
                                        }}>
                                        <Image style = { gridItemStyles.listItemActionsIcon } source = { require('../images/Icons/listItemActions.png') } />
                                    </TouchableOpacity> : null
                            }
                        </View>
                        {
                            (() => {
                                if(props.isSelectionModeEnabled) {
                                    return isSelected 
                                        ? <Image style = { gridItemStyles.selectedIcon } source = { require('../images/Icons/GridItemSelected.png') } />    
                                        : <Image style = { gridItemStyles.selectedIcon } source = { require('../images/Icons/GridItemUnselected.png') } />
                                }
                            })()
                        }
                    </View>
            </TouchableOpacity>
        );
    }
}   

GridItemComponent.propTypes = {
    itemType: PropTypes.string,
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
};

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
        top: getWidth(32), 
        left: getHeight(12) 
    },
    cancelDownloadImage: { 
        height: getHeight(24), 
        width: getWidth(24) 
    }
});