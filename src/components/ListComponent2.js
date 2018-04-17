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
import ListItemComponent2 from "../components/ListItemComponent2";
import GridItemComponent2 from '../components/GridItemComponent2';
import ExpanderComponent from '../components/ExpanderComponent';
import ListItemModel from '../models/ListItemModel';
import PropTypes from 'prop-types';
import { getWidth, getHeight } from '../utils/adaptive';
import SORTING from '../utils/constants/sortingConstants';

/**
* Custom List component
*/
export default class ListComponent2 extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            refreshing: false
        };

        this.onCancelPress = props.onCancelPress ? props.onCancelPress : () => {};
    }

    shouldComponentUpdate(nextProps) {    
        return this.props.screens === nextProps.activeScreen;
    } 

    /**
     * Fires on swipe from top to bottom to refresh the data
     */
    onRefresh() {
        this.setState({refreshing: true});
        
        this.props.onRefresh();

        this.setState({refreshing: false});
    }

    sortByDate(items, sortingObject) {
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        items.forEach((item) => {
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

    sortByName(items, sortingObject) {        
        let rows = [];
        rows = [...new Set(items.map((item) => {            
            let firstChar = item.getName().charAt(0);            
            if(rows.includes(firstChar.toUpperCase()))
                return ;
        }))];      

        items.forEach((item) => {
            var firstLetter = item.getName()[0];

            var prop = item.getName().charAt(0);            
            
            if(!sortingObject[prop]) {
                sortingObject[prop] = [];
            }

            sortingObject[prop].push(item);
        });
    }
   
    searchFilter(data) {
        if(!this.props.searchSubSequence) return data;

        return data.filter(item => 
            item.getName()
                .toLowerCase()
                .includes(this.props.searchSubSequence.toLowerCase()));

    }

    sort(items) {
        let data = this.searchFilter(items);

        let sortingObject = {};
        let sortingCallback;

        switch(this.props.sortingMode) {
            case SORTING.BY_DATE: sortingCallback = this.sortByDate;
                break;
            case SORTING.BY_NAME: sortingCallback = this.sortByName;
                break;
            default: sortingCallback = this.sortByDate;
        }
        
        sortingCallback(data, sortingObject);
        
        return sortingObject;
    }

    isItemActionsSelected = (item) => item.getId() === this.props.selectedItemId;

    getGridItemsList() {
        let sorting = this.sort(this.props.data);

        return Object.getOwnPropertyNames(sorting).reverse().map((propName, index) => {
            return (
                <View key = { propName }>
                    {
                        (() => {
                            let prop = sorting[propName];
                            let rowNumber = 1;

                            if(Array.isArray(prop) && prop.length) {

                                if(prop.length > 3) {
                                    rowNumber = Math.floor(prop.length / 3);

                                    if(prop.length % 3 != 0) {
                                        rowNumber += 1
                                    }
                                }

                                let data = [];

                                for(let i = 0; i < rowNumber; i++) {
                                    data.push(prop.splice(0,3));
                                }

                                let listItems = data.map((element, listIndex) => {
                                    return(
                                        <View key = { listIndex } style = { styles.unitContainer }>
                                            {
                                                element.map((item) => {
                                                    return(
                                                        <View style = { styles.itemContainer } key = { item.getId() }>
                                                            { this.getItem(item, GridItemComponent2) }
                                                        </View>
                                                    );
                                                })
                                            }
                                        </View>
                                    );
                                })
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

    getListItemsList() {
        let sorting = this.sort(this.props.data);

        return Object.getOwnPropertyNames(sorting).reverse().map((propName, index) => {
            return (
                <View key = { propName }>
                    {
                        (() => {
                            let prop = sorting[propName];
                            if(Array.isArray(prop) && prop.length) {
                                let listItems = prop.map((item, indexInner) => { 
                                    return this.getItem(item, ListItemComponent2);
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

    getItemsWithoutExpander() {
        return this.props.data.map((item) => {
            return this.getItem(item);
        })
    }

    getItem(item, ItemType) {
        const listItemIconSource = item.getStarred() ? this.props.starredListItemIcon : this.props.listItemIcon;
        const isSingleItemSelected = this.isItemActionsSelected(item);
        const TextComp = this.props.textComp;

        return(
            <ItemType
                key = { item.getId() }
                listItemIconSource = { listItemIconSource }
                onPress = { () => { this.props.onPress(item); } }
                onLongPress = { () => { this.props.onLongPress(item); } }
                onDotsPress = { () => { this.props.onDotsPress(item); } }
                onCancelPress = { () => { this.onCancelPress(item); } }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { isSingleItemSelected }
                isSelected = { item.isSelected }
                isLoading = { item.isLoading }
                progress = { item.progress } >

                <TextComp style = { styles.mainTitleText }>{ item.getName() }</TextComp>
            </ItemType>
        );
    }

    getItemsList() {
        if(this.props.isExpanderDisabled)
            return this.getItemsWithoutExpander();

        return this.props.isGridViewShown 
                    ? this.getGridItemsList()
                    : this.getListItemsList();
    }

    render() {                     
        return (
                <Animated.ScrollView style = { styles.listContainer }
                    decelerationRate = { 'normal' }
                    scrollEventThrottle = { 16 }
                    onScroll = {
                        Animated.event([{
                            nativeEvent: { 
                                    contentOffset: { 
                                        y: this.props.animatedScrollValue 
                                    } 
                                }
                            }
                        ], { useNativeDriver: true }) }
                    refreshControl = {
                        <RefreshControl
                            enabled = { !this.props.isSelectionMode }
                            refreshing = { this.state.refreshing }
                            onRefresh = { this.onRefresh.bind(this) } /> }>
                            <View style = { this.props.contentWrapperStyle ? this.props.contentWrapperStyle : null }>
                                {
                                    this.getItemsList()
                                }
                            </View>
                </Animated.ScrollView>       
        );
    }
}

/* ListComponent2.propTypes = {
    isExpanderDisabled: PropTypes.bool,
    listItemIcon: PropTypes.number,
    mainTitlePath: PropTypes.string,
    sortOptions: PropTypes.string,
    idPath: PropTypes.string,
    onPress: PropTypes.func,
    onSingleItemSelected: PropTypes.func,                   
    animatedScrollValue: PropTypes.object,
    enableSelectionMode: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    isSelectDisabled: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    deselectItem: PropTypes.func,
    selectItem: PropTypes.func,
    data: PropTypes.array,
    bucketsCount: PropTypes.number
}; */

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: 'white'
    },
    unitContainer: { 
        flexDirection: 'row',
        width: getWidth(333),  
        height: getHeight(130)
    },
    itemContainer: {
        alignSelf: 'flex-start'
    },
    mainTitleText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16),
        color: '#384B65'
    }
});


