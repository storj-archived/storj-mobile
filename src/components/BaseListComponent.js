import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../components/ListComponent';
import { getHeight } from '../utils/adaptive';
import { TYPES } from '../utils/constants/typesConstants';
import PropTypes from 'prop-types';

export default class BaseListComponent extends Component {
    constructor(props) {
        super(props);

        this.ListComponent = ListComponentWrapper.bind(this);
    }

    render() {
        return null;
    }
}

function ListComponentWrapper(props) {
    return(
        <ListComponent
            isExpanderDisabled = { this.props.isExpanderDisabled }
            textComp = { props.textComp }
            listItemIcon = { props.listItemIcon }
            cloudListItemIcon = { props.cloudListItemIcon }
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

//TODO: add props