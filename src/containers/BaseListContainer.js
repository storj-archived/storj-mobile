import React, { Component } from 'react';
import ServiceModule from '../utils/ServiceModule';
import StorjModule from '../utils/StorjModule';
import ListItemModel from '../models/ListItemModel';
import PropTypes from 'prop-types';

/** 
 * Base class for all screen containers with lists
*/
class BaseListContainer extends Component {
    constructor(props) {
        super(props);
    }
    
    /**
     *Remove standart navigation header 
     */
    static navigationOptions = {
        header: null
    };
    
    /**
     * Callback passed to ListItem onPress
     * @param {ListItemModel} item
     */
    onPress(item) {
        if(this.props.isSingleItemSelected) {
            this.disableSelectionMode();
            return;
        }

        if(this.props.isSelectionMode) {                                             
            this._onSelectionPress(item);
            return;
        }
        
        this._onPress(item);
    }

    /**
     * Callback passed to ListItemComponent onLongPressPress
     * @param {ListItemModel} item
     */
    onLongPress(item) {
        if(!this.props.isSelectionMode) {
            this.props.enableSelectionMode();
            this._onSelectionPress(item);
        }
    }
    
    /**
     * Callback passed to side icon of ListItemComponent
     * @param {ListItemModel} item
     */
    onDotsPress(item) {
        if(this.props.isSingleItemSelected) {
            this.disableSelectionMode();
        } else {
            this.props.onSingleItemSelected();
            this._onSelectionPress(item);
            this.props.setSelectionId(item.getId());
        }
    }

    /**
     * Disable mainReducers selection mode
     */
    disableSelectionMode() {
        this.props.setSelectionId(null);
        this.props.disableSelectionMode();
    }

    /**
     * Get selected items count from array of ListItemModels
     * @param {ListItemModel[]} items
     * @returns {Number} 
     */
    getSelectedItemsCount(items) {
        return items.filter(item => item.isSelected === true).length;
    }

    /**
     * Definition of virtual method that handles ListItemModel on onPress
     * @param {ListItemModel} item 
     */
    _onPress(item) {}
    /**
     * Definition of virtual method that handles change of ListItemModel
     * selection status   
     * @param {ListItemModel} item 
     */
    _onSelectionPress(item) {}
    /**
     * Definition of virtual method passed to 
     * ListItemModel's onCancel
     * @param {ListItemModel} item 
     */
    onCancelPress(item) {}

    render() {
        return null;
    }
}

export default BaseListContainer;