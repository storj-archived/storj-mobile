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
            isSelectionModeEnabled: false,
            refreshing: false,
            items: [
                new ListItemModel({name: 'name_1', size: 1, id: '1', date: '20-11-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_2', size: 4, id: '2', date: '20-12-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_3', size: 2, id: '3', date: '20-13-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_33', size: 3, id: '4', date: '20-15-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_4', size: 9, id: '5', date: '20-14-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_5', size: 6, id: '6', date: '20-18-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_6', size: 5, id: '7', date: '20-16-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_7', size: 7, id: '8', date: '20-15-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_8', size: 8, id: '9', date: '20-11-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_9', size: 9, id: '10', date: '20-12-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_10', size: 10, id: '11', date: '20-13-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_11', size: 11, id: '12', date: '20-15-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_12', size: 12, id: '13', date: '20-14-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_13', size: 13, id: '14', date: '20-18-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_14', size: 14, id: '15', date: '20-16-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_15', size: 15, id: '16', date: '20-15-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_16', size: 16, id: '17', date: '20-11-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_17', size: 17, id: '18', date: '20-12-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_18', size: 18, id: '19', date: '20-13-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_19', size: 19, id: '20', date: '20-15-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_20', size: 20, id: '21', date: '20-14-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_21', size: 21, id: '22', date: '20-18-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_22', size: 22, id: '23', date: '20-16-2017'}, 'name', 'id', ['name', 'size', 'date']),
                new ListItemModel({name: 'name_23', size: 23, id: '24', date: '20-15-2017'}, 'name', 'id', ['name', 'size', 'date'])
            ]
        };
    };

    /**
    * Fires on long press
    * @param {object} item type of ListItemModel
    */
    onItemLongPress(item) {
        this.setState({ isSelectionModeEnabled: true });
        this.selectItem(item);
    };   

    /**
    * Fires on swipe from top to bottom to refresh the data
    */
    onRefresh() {
        this.setState({refreshing: true});
        
        let newItems = this.state.items.map((item) => {
            let newItem = new ListItemModel(item.entity, item.mainTitlePath, item.idPath, item.sortOptions, item.isSelected);
             return newItem;
        });

        this.setState({
            items: newItems
        });

        this.setState({refreshing: false});
    }

    /**
    * Fires on long press
    * @param {object} item type of ListItemModel
    */
    selectItem(selectedItem) {
        if(!this.state.isSelectionModeEnabled) return;
        let idPath = selectedItem.idPath;

        let newItems = this.state.items.map((item) => {
            let newItem = new ListItemModel(item.entity, item.mainTitlePath, item.idPath, item.sortOptions, item.isSelected);
            
             if(selectedItem.entity[idPath] === item.entity[idPath]){
                 newItem.isSelected = !newItem.isSelected;
             } 

             return newItem;
        });

        this.setState({
            items: newItems
        });
    };

    render() {
        return (
            <ScrollView style = { styles.listContainer }
                refreshControl={
                    <RefreshControl
                        enabled = { !this.state.isSelectionModeEnabled }
                        refreshing = { this.state.refreshing }
                        onRefresh = { this.onRefresh.bind(this) } /> }>
                {
                    this.state.items.map((item) => {
                         return(<ListItemComponent 
                                    item = { item } 
                                    onLongPress = { () => { this.onItemLongPress(item); } }
                                    isSelectionModeEnabled = { this.state.isSelectionModeEnabled }
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