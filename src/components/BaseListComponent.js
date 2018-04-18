import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import React, { Component } from 'react';
import ListComponent2 from '../components/ListComponent2';
import { getHeight } from '../utils/adaptive';
import { TYPES } from '../utils/constants/typesConstants';
import PropTypes from 'prop-types';

export default class BaseListComponent extends Component {
    constructor(props) {
        super(props);

        this.ListComponent = ListComponent.bind(this);
    }

    render() {
        return null;
    }
}

function ListComponent(props) {
    return(
        <ListComponent2
            textComp = { props.textComp }
            listItemIcon = { props.listItemIcon }
            starredListItemIcon = { props.starredListItemIcon }
            contentWrapperStyle = { props.contentWrapperStyle }
            getItemSize = { this.props.getItemSize } 
            isRefreshing = { this.props.isLoading }
            searchSubSequence = { this.props.searchSubSequence }
            sortingMode = { this.props.sortingMode }                  
            onRefresh = { this.props.onRefresh }
            isGridViewShown = { this.props.isGridViewShown }
            onPress = { this.props.onPress }
            onLongPress = { this.props.onLongPress }
            onDotsPress = { this.props.onDotsPress }
            onCancelPress = { this.props.onCancelPress }
            selectedItemId = { this.props.selectedItemId }                 
            animatedScrollValue = { this.props.animatedScrollValue }
            isSelectionMode = { this.props.isSelectionMode }
            data = { this.props.data } />
    ); 
}

/* BucketsListComponent.propTypes = {
    activeScreen: PropTypes.string,
    animatedScrollValue: PropTypes.object,
    buckets: PropTypes.array,
    deselectBucket: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    enableSelectionMode: PropTypes.func,
    isGridViewShown: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    onPress: PropTypes.func,
    refresh: PropTypes.func,
    selectBucket: PropTypes.func,
    selectedItemId: PropTypes.string,
    setSelectionId: PropTypes.func
} */