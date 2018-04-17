import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../components/ListComponent';
import ListComponent2 from '../components/ListComponent2';
import { getHeight } from '../utils/adaptive';
import { TYPES } from '../utils/constants/typesConstants';
import PropTypes from 'prop-types';

export default class BucketsListComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <ListComponent2
                    textComp = { (props) => <Text numberOfLines = { 1 } style = { props.style }>{ props.children }</Text> }
                    searchSubSequence = { this.props.searchSubSequence }
                    sortingMode = { this.props.sortingMode }
                    activeScreen = { this.props.activeScreen }
                    screens = { "BucketsScreen" }                    
                    contentWrapperStyle = { styles.contentWrapper }
                    onRefresh = { this.props.refresh }
                    setSelectionId = { this.props.setSelectionId }
                    isGridViewShown = { this.props.isGridViewShown }
                    onPress = { this.props.onPress }
                    onLongPress = { this.props.onLongPress }
                    onDotsPress = { this.props.onDotsPress }
                    itemType = { TYPES.REGULAR_BUCKET }
                    selectedItemId = { this.props.selectedItemId }
                    onSingleItemSelected = { this.props.onSingleItemSelected }                    
                    animatedScrollValue = { this.props.animatedScrollValue }
                    enableSelectionMode = { this.props.enableSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    isSelectionMode = { this.props.isSelectionMode }
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    listItemIcon = { require('../images/Icons/BucketListItemIcon.png') }
                    starredListItemIcon = { require('../images/Icons/ListStarredBucket.png') }
                    starredGridItemIcon = { require('../images/Icons/GridStarredBucket.png') } 
                    deselectItem = { this.props.deselectBucket }
                    selectItem = { this.props.selectBucket }
                    data = { this.props.buckets } />              
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentWrapper: {
        paddingTop: getHeight(58),
        paddingBottom: getHeight(60)
    }
});

BucketsListComponent.propTypes = {
    activeScreen: PropTypes.string,
    animatedScrollValue: PropTypes.object,
    buckets: PropTypes.array,
    deselectBucket: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    enableSelectionMode: PropTypes.func,
    isGridViewShown: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    onPress: PropTypes.func,
    onSingleItemSelected: PropTypes.func,
    refresh: PropTypes.func,
    selectBucket: PropTypes.func,
    selectedItemId: PropTypes.string,
    setSelectionId: PropTypes.func
}