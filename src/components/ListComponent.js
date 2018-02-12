import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Text,
    Image,
    Keyboard,
    TouchableOpacity,
    Animated
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
            refreshing: false,
            selectedItemId: null        
        };
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { this.setState({ selectedItemId: null }); });
    }
    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
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
        /* if(!this.props.isSelectionMode) return; */
        
        if(selectedItem.isSelected)
            this.props.deselectItem(selectedItem);
        else
            this.props.selectItem(selectedItem);
    }

    sortByDate(buckets, sortingObject) {
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ];

        buckets.forEach((item) => {
            var date = new Date(item.getDate());
            
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            var prop = day + ' ' + monthNames[monthIndex] + ' ' + year;            
            
            if(!sortingObject[prop]) {
                sortingObject[prop] = [];
            }

            sortingObject[prop].push(item);
        });
    }

    sortByName(buckets, sortingObject) {        
        let rows = [];
        rows = [...new Set(buckets.map((item) => {
            let firstChar = item.getName().charAt(0);
            if(rows.exists(firstChar.toUpperCase()))
                return ;
        }))];

        console.log(rows);        

        buckets.forEach((item) => {
            var firstLetter = item.getName()[0];

            var prop = item.getName().charAt(0);            
            
            if(!sortingObject[prop]) {
                sortingObject[prop] = [];
            }

            sortingObject[prop].push(item);
        });
    }

    sort(buckets) {
        let sortingObject = {};
        let sortingCallback;

        switch('date') {
            case 'date': sortingCallback = this.sortByDate;
                break;
            case 'name': sortingCallback = this.sortByName;
                break;
        }
        
        sortingCallback(buckets, sortingObject);
        
        return sortingObject;
    }

    getBucketsList() {
        let sorting = this.sort(this.props.data);

        return Object.getOwnPropertyNames(sorting).reverse().map((propName, index) => {
            return (
                <View key = { propName }>
                    {
                        (() => {
                            let prop = sorting[propName];
                            if(Array.isArray(prop) && prop.length) {
                                var listItems = prop.map((item, indexInner) => {
                                    return(
                                        <ListItemComponent
                                            key = { item.entity.id }
                                            item = { item } 
                                            isFileLoading = { false }
                                            selectItemId = { (itemId) => { this.setState({ selectedItemId: itemId }) }}
                                            isItemActionsSelected = { this.state.selectedItemId === item.getId() }
                                            onLongPress = { () => { this.onItemLongPress(item); } }
                                            isSelectionModeEnabled = { this.props.isSelectionMode }
                                            isSelected = { item.isSelected }
                                            isSingleItemSelected = { this.props.isSingleItemSelected }
                                            disableSelectionMode = { this.props.disableSelectionMode }
                                            onPress = { () => { this.selectItem(item); } }
                                            progress = { 0 }
                                            onSingleItemSelected = { this.props.onSingleItemSelected } />
                                    );
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
        });
    }

    render() {        
        return (
            <View>
                <Animated.ScrollView style = { styles.listContainer }
                    scrollEventThrottle = { 16 }
                    style = { styles.listContainer }
                    onScroll = {
                        Animated.event([{
                            nativeEvent: { 
                                    contentOffset: { 
                                        y: this.props.animatedScrollValue 
                                    } 
                                }
                            }
                        ], { useNativeDriver: true }) }
                    refreshControl={
                        <RefreshControl
                            enabled = { !this.props.isSelectionMode }
                            refreshing = { this.state.refreshing }
                            onRefresh = { this.onRefresh.bind(this) } /> }>

                            <View style = { styles.contentWrapper }>
                                {
                                    this.getBucketsList()
                                }
                            </View>
                </Animated.ScrollView>
            </View>            
        );
    }
}

//TODO: check if all props are valid
ListComponent.propTypes = {
    data: PropTypes.array,
    /* onSingleItemSelected: PropTypes.function, */
    /* selectItem: PropTypes.function,
    deselectItem: PropTypes.function, */
    mainTitlePath: PropTypes.string,
    sortOptions: PropTypes.string,
    idPath: PropTypes.string
};

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: 'white',
    },
    contentWrapper: {
        paddingVertical: getHeight(80)
    }
});
