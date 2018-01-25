import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import ListItemComponent from '../components/ListItemComponent'
import ListItemModel from '../models/ListItemModel'
import PropTypes from 'prop-types';

/**
* Custom List component
*/
export default class ListComponent extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            refreshing: false
        };
    };

    /**
    * Fires on long press
    * @param {object} item type of ListItemModel
    */
    onItemLongPress(item) {
        console.log("Long Press", item);
        this.props.enableSelectionMode();
        this.selectItem(item);
    };   

    /**
    * Fires on swipe from top to bottom to refresh the data
    */
    onRefresh() {
        this.setState({refreshing: true});
        
        //TODO: call getBuckets function

        this.setState({refreshing: false});
    }

    /**
    * Fires on long press
    * @param {object} item type of ListItemModel
    */
    selectItem(selectedItem) {
        if(!this.props.isSelectionMode) return;
        console.log(selectedItem.isSelected);
        if(selectedItem.isSelected)
            this.props.deselectItem(selectedItem);
        else
            this.props.selectItem(selectedItem);
    };

    render() {
        return (
            <ScrollView style = { styles.listContainer }
                refreshControl={
                    <RefreshControl
                        enabled = { !this.props.isSelectionMode }
                        refreshing = { this.state.refreshing }
                        onRefresh = { this.onRefresh.bind(this) } /> }>
                {
                    this.props.data.map((item, index) => {
                         return(<ListItemComponent
                                    key = { index }
                                    item = { item } 
                                    onLongPress = { () => { this.onItemLongPress(item); } }
                                    isSelectionModeEnabled = { this.props.isSelectionMode }
                                    onPress = { () => { this.selectItem(item); } } /> 
                        )})   
                }
            </ScrollView>
        );
    };
}

ListComponent.PropTypes = {
    data: PropTypes.array,
    selectedItems: PropTypes.array,
    selectItem: PropTypes.function,
    deselectItem: PropTypes.function,
    mainTitlePath: PropTypes.string,
    sortOptions: PropTypes.string,
    idPath: PropTypes.string
};

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: 'white'
    }
});