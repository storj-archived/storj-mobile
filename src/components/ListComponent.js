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
import GridItemComponent from '../components/GridItemComponent';
import ExpanderComponent from '../components/ExpanderComponent';
import ListItemModel from '../models/ListItemModel';
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

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {  });
    }
    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
    }

    shouldComponentUpdate(nextProps) {    
        return this.props.screens === nextProps.activeScreen;
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
        
        this.props.onRefresh();

        this.setState({refreshing: false});
    }

    /**
    * Fires on long press
    * @param {object} item type of ListItemModel
    */
    selectItem(selectedItem) {
        if(selectedItem.isSelected)
            this.props.deselectItem(selectedItem);
        else
            this.props.selectItem(selectedItem);
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
            if(rows.exists(firstChar.toUpperCase()))
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
   
    sort(items) {
        let sortingObject = {};
        let sortingCallback;

        switch('date') {
            case 'date': sortingCallback = this.sortByDate;
                break;
            case 'name': sortingCallback = this.sortByName;
                break;
        }
        
        sortingCallback(items, sortingObject);
        
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
                                                            <GridItemComponent
                                                                cancelUpload = { this.props.cancelUpload }
                                                                cancelDownload = { this.props.cancelDownload }
                                                                bucketId = { this.props.bucketId }
                                                                item = { item } 
                                                                selectItemId = { (itemId) => { this.props.setSelectionId(itemId); } }
                                                                navigateToFilesScreen = { this.props.navigateToFilesScreen ? this.props.navigateToFilesScreen : () => {} }
                                                                isItemActionsSelected = { this.isItemActionsSelected(item) }
                                                                onLongPress = { () => { this.onItemLongPress(item); } }
                                                                isSelectionModeEnabled = { this.props.isSelectionMode }
                                                                isSelected = { item.isSelected }
                                                                isStarred = { item.getStarred() }
                                                                isSingleItemSelected = { this.props.isSingleItemSelected }
                                                                disableSelectionMode = { this.props.disableSelectionMode }
                                                                progress = { item.progress }                                                                
                                                                isLoading = { item.isLoading }
                                                                itemType = { this.props.itemType }
                                                                listItemIcon = { this.props.listItemIcon }
                                                                starredGridItemIcon = { this.props.starredGridItemIcon }
                                                                onSelectionPress = { () => { this.selectItem(item); } }
                                                                onPress = { this.props.onPress }
                                                                onSingleItemSelected = { this.props.onSingleItemSelected } />
                                                        </View>
                                                    )
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
                                var listItems = prop.map((item, indexInner) => { 
                                    return(
                                        <ListItemComponent
                                            cancelUpload = { this.props.cancelUpload }
                                            cancelDownload = { this.props.cancelDownload }
                                            bucketId = { this.props.bucketId }
                                            key = { item.getId() }
                                            item = { item } 
                                            selectItemId = { (itemId) => { this.props.setSelectionId(itemId); }}
                                            navigateToFilesScreen = { this.props.navigateToFilesScreen ? this.props.navigateToFilesScreen : () => {} }
                                            isItemActionsSelected = { this.isItemActionsSelected(item) }
                                            onLongPress = { () => { this.onItemLongPress(item); } }
                                            isSelectionModeEnabled = { this.props.isSelectionMode }
                                            isSelected = { item.isSelected }
                                            isSingleItemSelected = { this.props.isSingleItemSelected }
                                            disableSelectionMode = { this.props.disableSelectionMode }
                                            progress = { item.progress }
                                            isLoading = { item.isLoading }
                                            isStarred = { item.getStarred() }
                                            listItemIcon = { this.props.listItemIcon }
                                            starredListItemIcon = { this.props.starredListItemIcon }
                                            onSelectionPress = { () => { this.selectItem(item); } }
                                            onPress = { this.props.onPress }
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

    getItemsWithoutExpander() {
        props = this.props;

        function onPress(file) {  
            let bucketId =  file.bucketId ? file.bucketId : file.entity.bucketId;
            
            props.openBucket(bucketId);
            props.navigateToDashboardFilesScreen(bucketId);              
        }

        return this.props.data.map((item) => {
            
            return (
                <ListItemComponent
                    bucketId = { this.props.bucketId }
                    key = { item.getId() }
                    item = { item } 
                    selectItemId = { (itemId) => { this.props.setSelectionId(itemId); }}
                    navigateToFilesScreen = { this.props.navigateToDashboardFilesScreen ? this.props.navigateToDashboardFilesScreen : () => {} }
                    isItemActionsSelected = { this.isItemActionsSelected(item) }
                    onLongPress = { () => { this.onItemLongPress(item); } }
                    isSelectionModeEnabled = { this.props.isSelectionMode }
                    isSelected = { item.isSelected }
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    isStarred = { item.getStarred() }
                    progress = { item.progress }
                    isLoading = { item.isLoading }
                    listItemIcon = { this.props.listItemIcon }
                    starredListItemIcon = { this.props.starredListItemIcon }
                    onSelectionPress = { () => { this.selectItem(item); } }
                    onPress = { (file) => { onPress(file); } }
                    onSingleItemSelected = { this.props.onSingleItemSelected } />
            )
        })
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

ListComponent.propTypes = {
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
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    deselectItem: PropTypes.func,
    selectItem: PropTypes.func,
    data: PropTypes.array,
    bucketsCount: PropTypes.number
};

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
    }
});


