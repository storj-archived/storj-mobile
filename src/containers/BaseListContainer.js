import React, { Component } from 'react';
import ServiceModule from '../utils/ServiceModule';
import StorjModule from '../utils/StorjModule';
import PropTypes from 'prop-types';

/** 
 * Base class for all screen with lists
*/
class BaseListContainer extends Component {
    constructor(props) {
        super(props);
    }
    
    static navigationOptions = {
        header: null
    };
            
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

    onLongPress(item) {
        if(!this.props.isSelectionMode) {
            this.props.enableSelectionMode();
            this._onSelectionPress(item);
        }
    }
    
    onDotsPress(item) {
        if(this.props.isSingleItemSelected) {
            this.disableSelectionMode();
        } else {
            this.props.onSingleItemSelected();
            this._onSelectionPress(item);
            this.props.setSelectionId(item.getId());
        }
    }

    disableSelectionMode() {
        this.props.setSelectionId(null);
        this.props.disableSelectionMode();
    }

    getSelectedItemsCount(listItemModels) {
        return listItemModels.filter(listItemModel => listItemModel.isSelected === true).length;
    }

    render() {
        return null;
    }
}

export default BaseListContainer;