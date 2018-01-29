import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import ListItemComponent from '../components/ListItemComponent';
import ListItemModel from '../models/ListItemModel';
import ExpanderComponent from '../components/ExpanderComponent';
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

    sort(buckets) {
        let sortingObject = [];
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ];

        buckets.forEach((item) => {
            
            // comparer, depends on property, should be a callback
            var date = new Date(item.getDate());
            
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            var prop = day + ' ' + monthNames[monthIndex] + ' ' + year;            
            prop += '';
            
            if(!sortingObject[prop]) {
                sortingObject[prop] = [];
            }

            sortingObject[prop].push(item);
        });

        return sortingObject;
    }

    render() {        
        let sorting = this.sort(this.props.data);

        return (            
            <ScrollView style = { styles.listContainer }
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
                        <View style = { styles.contentWrapper }>
                            {
                                Object.getOwnPropertyNames(sorting).map((propName, index) => {
                                    return (
                                        <View>
                                            {
                                                (() => {
                                                    let prop = sorting[propName];
                                                    if(Array.isArray(prop) && prop.length) {
                                                        var listItems = prop.map((item) => {
                                                            return(<ListItemComponent
                                                                        key = { index }
                                                                        item = { item } 
                                                                        onLongPress = { () => { this.onItemLongPress(item); } }
                                                                        isSelectionModeEnabled = { this.props.isSelectionMode }
                                                                        onPress = { () => { this.selectItem(item); } } />)
                                                        });
                                                        return(
                                                            <ExpanderComponent
                                                                propName = { propName } 
                                                                listItems = { listItems } />
                                                        );
                                                    }
                                                })()
                                            }
                                        </View>
                                    );
                                })
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
        backgroundColor: 'white',
    },
    contentWrapper: {
        paddingVertical: getHeight(55)
    }
});