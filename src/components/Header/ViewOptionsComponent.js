import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../../utils/adaptive';
import SORTING from '../../utils/constants/sortingConstants';

//TODO: remove arrow func part 2
export default ViewOptionsComponent = (props) => {

    renderOptionItem = (imageSource, title, onPress) => {
        return(
            <TouchableOpacity style = { styles.itemContainer } onPress = { onPress } >
                <View style = { styles.marginImage }>
                    <Image source = { imageSource } style = { styles.iconContainer } resizeMode = 'contain' />
                </View> 
                <View style = { styles.marginLabel }>
                    <Text style = { styles.labelText }>{ title }</Text>
                </View>
            </TouchableOpacity>
        )
    };

    listView = () => {
        props.setListView(); 
        props.showOptions();
    };

    gridView = () => {
        props.setGridView();
        props.showOptions();
    };

    enableSelectionMode = () => {
        props.enableSelectionMode();
        props.showOptions();
    };

    renderMainOptions = () => {
        return(
            <View style = { styles.mainContainer } >
                {
                    renderOptionItem( require('../../images/Icons/SortIcon.png'), "Sort items...", props.setSortingShown )
                }
                {
                    props.isGridViewShown ?
                        renderOptionItem( 
                            require('../../images/Icons/ListIcon.png'),
                            "List view", 
                            listView
                        ) :
                        renderOptionItem( 
                            require('../../images/Icons/GridIcon.png'),
                            "Grid view", 
                            gridView
                        )   
                }
                {
                    renderOptionItem( 
                        require('../../images/Icons/SelectItems.png'),
                        "Select items", 
                        enableSelectionMode
                    )
                }
            </View>
        )
    };

    sortByDate = () => {
        props.setSorting(SORTING.BY_DATE);
        props.getBuckets(SORTING.BY_DATE);
        props.getFiles(SORTING.BY_DATE);
        props.showOptions();
        props.unsetSortingShown();
    };

    sortByName = () => {
        props.setSorting(SORTING.BY_NAME);
        props.getBuckets(SORTING.BY_NAME);
        props.getFiles(SORTING.BY_NAME);
        props.showOptions();
        props.unsetSortingShown();
    };

    renderSorting = () => {
        return(
            <View style = { styles.mainContainer } >
                {
                    renderOptionItem( 
                        null, 
                        "Sort by date", 
                        sortByDate
                    )
                }
                {
                    renderOptionItem( 
                        null, 
                        "Sort by name", 
                        sortByName
                    )
                }
            </View>
        )
    };

    return(
        <View style = { [ styles.backgroundWrapper ] }>  
            <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { props.showOptions } />
            {
                props.isSortingShown ? renderSorting() : renderMainOptions()
            }
        </View>
    );
}

ViewOptionsComponent.propTypes = {
    showOptions: PropTypes.func,
    isGridViewShown: PropTypes.bool,
    setGridView: PropTypes.func,
    setListView: PropTypes.func,
    enableSelectionMode: PropTypes.func,
    getBuckets: PropTypes.func,
    getFiles: PropTypes.func,
    isSelectionMode: PropTypes.bool,
    setSorting: PropTypes.func
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        alignSelf: 'center',
        borderRadius: 6,
        marginTop: getHeight(30)
    },
    backgroundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.2
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: getHeight(55), 
        borderBottomWidth: 0.5, 
        borderBottomColor: 'rgba(56, 75, 101, 0.2)'
    },
    iconContainer: {
        height: getHeight(24),
        width: getWidth(24)
    },
    labelText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        lineHeight: getHeight(19),
        color: '#2794FF'
    },
    marginImage: {
        marginLeft: getWidth(20)
    },
    marginLabel: {
        marginLeft: getWidth(15)
    }
});