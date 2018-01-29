import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import ListItemComponent from '../components/ListItemComponent'
import ListItemModel from '../models/ListItemModel'
import PropTypes from 'prop-types';
import { getWidth, getHeight } from '../utils/adaptive';

/**
* Custom List component
*/
export default class ListComponent extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            refreshing: false
        };
    }

    /**
    * Fires on long press
    * @param {object} item type of ListItemModel
    */
    onItemLongPress(item) {
        this.props.enableSelectionMode();
        this.selectItem(item);
    }   

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

        if(selectedItem.isSelected)
            this.props.deselectItem(selectedItem);
        else
            this.props.selectItem(selectedItem);
    };

    render() {
        return (
            <ScrollView
                scrollEventThrottle = { 16 }
                style = { styles.listContainer }
                onScroll = { (event) => {
                    /* let y_offset = event.nativeEvent.contentOffset.y;

                    if(y_offset >= 0 && y_offset < 100) {
                        console.log(y_offset);
                        this.props.onScrollCallback(0);
                    }

                    if(y_offset > 100) {
                        this.props.onScrollCallback(100);
                    } */
                } }
                refreshControl={
                    <RefreshControl
                        enabled = { !this.props.isSelectionMode }
                        refreshing = { this.state.refreshing }
                        onRefresh = { this.onRefresh.bind(this) } /> }>
                <View style={ styles.test }>
                    {
                        this.props.data.map((item, index) => {
                                return(<ListItemComponent
                                        key = { index }
                                        item = { item }
                                        isSelected = { item.isSelected }
                                        onLongPress = { () => { this.onItemLongPress(item); } }
                                        isSelectionModeEnabled = { this.props.isSelectionMode }
                                        onPress = { () => { this.selectItem(item); } } /> 
                            )})   
                    }
                </View>
            </ScrollView>
        );
    };
}

ListComponent.propTypes = {
    data: PropTypes.array,
    selectItem: PropTypes.function,
    deselectItem: PropTypes.function,
    mainTitlePath: PropTypes.string,
    sortOptions: PropTypes.string,
    idPath: PropTypes.string
};

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: 'transparent'
    },
    test: {
        marginTop: getHeight(70),
        marginBottom: getHeight(55)
    }
});