import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList
} from 'react-native';
import ListItemComponent from "./ListItemComponent";
import GridItemComponent from './GridItemComponent';
import ExpanderComponent from '../Common/ExpanderComponent';
import PropTypes from 'prop-types';
import { getWidth, getHeight, getDeviceWidth } from '../../utils/adaptive';
import SORTING from '../../utils/constants/sortingConstants';
import { getFileNameWithFixedSize } from "../../utils/fileUtils";

export default class ListComponent extends PureComponent {
    constructor(props) {
        super(props);

        this.sortByDate = this.sortByDate.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.searchFilter = this.searchFilter.bind(this);
        this.sort = this.sort.bind(this);
        this.isItemActionsSelected = this.isItemActionsSelected.bind(this);
        this.getListExpanders = this.getListExpanders.bind(this);
        this.getGridExpander = this.getGridExpander.bind(this);
        this.getListExpander = this.getListExpander.bind(this);
        this.getGridItem = this.getGridItem.bind(this);
        this.getItem = this.getItem.bind(this);
        this.getItemsList = this.getItemsList.bind(this);
        this.getRenderCallback = this.getRenderCallback.bind(this);
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
        items.forEach((item) => {
            var prop = item.getName().charAt(0).toUpperCase();            
            
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

    isItemActionsSelected(item) { return item.getId() === this.props.selectedItemId; } 

    getListExpanders() {
        var sorting = this.sort(this.props.data);

        var expanders = Object.getOwnPropertyNames(sorting).reverse().map((propName) => 
        {
            return {
                propName,
                prop: sorting[propName]
            }
        });

        return expanders;
    }

    getGridExpander(expander) {
        if(expander.item) expander = expander.item;

        return (
            <View>
            {
                (() => {
                    let rowNumber = 1;
                    let prop = expander.prop;

                    if(Array.isArray(prop) && prop.length) {

                        if(prop.length > 3) {
                            rowNumber = Math.floor(prop.length / 3);

                            if(prop.length % 3 !== 0) {
                                rowNumber += 1
                            }
                        }

                        let data = [];

                        for(let i = 0; i < rowNumber; i++) {
                            data.push(prop.splice(0,3));
                        }

                        return(
                            <ExpanderComponent
                                getItem = { this.getGridItem }
                                isListActionsDisabled = { this.props.isListActionsDisabled }
                                propName = { expander.propName }
                                listItems = { data } />
                        );
                    }
                })()
            }
            <View style = { styles.underLine }/>
        </View>);
    }

    getListExpander(expander) {
        if(expander.item) expander = expander.item;

        return (
            <View>
                <ExpanderComponent
                    getItem = { this.getItem }
                    isListActionsDisabled = { this.props.isListActionsDisabled }
                    propName = { expander.propName }
                    listItems = { expander.prop } />
                <View style = { styles.underLine }/>   
            </View>
        );
    }

    getGridItem(gridItem) {
        return(
            <View style = { styles.unitContainer }>
                {
                    gridItem.item.map((item) => {
                        return(
                            <View style = { styles.itemContainer }>
                                { this.getItem(item) }
                            </View>
                        );
                    })
                }
            </View>
        );
    }

    getItem(item) {
        if(item.item) item = item.item;
        const ItemType = this.props.isGridViewShown ? GridItemComponent : ListItemComponent;
        const TextComp = this.props.textComp;
        const isSingleItemSelected = this.isItemActionsSelected(item);
        const size = item.entity.size ? this.props.getItemSize(item.entity.size) : null;
        const listItemIconSource = item.entity.thumbnail ? 
                                    { uri: 'data:image/png;base64,' + item.entity.thumbnail } 
                                    : item.entity.isDownloaded ? this.props.listItemIcon : this.props.cloudListItemIcon;
        const starredIcon = item.getStarred() ? '★' : '';
        let fullItemName = getFileNameWithFixedSize(item.getName(), 20);

        return(
            <ItemType
                isExpanderDisabled = { this.props.isExpanderDisabled }
                key = { item.getId() }
                listItemIconSource = { listItemIconSource }
                onPress = { () => { this.props.onPress(item); } }
                onLongPress = { () => { this.props.onLongPress(item); } }
                onDotsPress = { () => { this.props.onDotsPress(item); } }
                onCancelPress = { () => { this.props.onCancelPress(item); } }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { isSingleItemSelected }
                isStarred = { item.getStarred() }
                isSelected = { item.isSelected }
                isLoading = { item.isLoading }
                progress = { item.progress } 
                size = { size }
                isListActionsDisabled = { this.props.isListActionsDisabled } >

                <TextComp style = { this.props.isExpanderDisabled ? [styles.mainTitleText, styles.textMargin] : styles.mainTitleText }>
                    <Text style = { styles.blueStar }>
                        { starredIcon }
                    </Text>
                    <Text> { fullItemName.name } </Text>
                    <Text style = { styles.extentionText } >{ fullItemName.extention }</Text>
                </TextComp>
            </ItemType>
        );
    }

    getItemsList() {
        return this.props.isExpanderDisabled ? this.props.data : this.getListExpanders();
    } 
    

    getRenderCallback() {
        if (this.props.isExpanderDisabled) return this.getItem;
         
        return this.props.isGridViewShown ? this.getGridExpander : this.getListExpander;
    }

    keyExtractor(item, i) {
        return "" + i;
    } 


    render() {
        return (    
            <View style = { this.props.contentWrapperStyle ? this.props.contentWrapperStyle : null }>
                <FlatList
                    style = { styles.listContainer }
                    data = { this.getItemsList() }
                    renderItem = { this.getRenderCallback() }
                    keyExtractor = { this.keyExtractor } />
            </View>
        );
    }
    
}

ListComponent.propTypes = {
    animatedScrollValue: PropTypes.object,
    cloudListItemIcon: PropTypes.number,
    contentWrapperStyle: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object
    ]),
    data: PropTypes.array,
    getItemSize: PropTypes.func,
    isExpanderDisabled: PropTypes.bool,
    isGridViewShown: PropTypes.bool,
    isListActionsDisabled: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    listItemIcon: PropTypes.number,
    onCancelPress: PropTypes.func,
    onDotsPress: PropTypes.func,
    onRefresh: PropTypes.func,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
    selectedItemId: PropTypes.string,
    sortingMode: PropTypes.string,
    textComp: PropTypes.func
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
    },
    mainTitleText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        color: '#384B65'
    },
    blueStar: {
        fontSize: getHeight(16),
        color: '#2794FF'
    },
    underLine: { 
        height: 0.5, 
        width: getDeviceWidth(), 
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    },
    textMargin: {
        marginLeft: getWidth(10)
    },
    extentionText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        color: 'rgba(56, 75, 101, 0.4)'
    }
});
