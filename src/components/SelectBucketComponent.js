import {
    View,
    StyleSheet,
    Animated,
    Text
} from 'react-native';
import React, { Component } from 'react';
//import ListComponent from '../components/ListComponent';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import { getHeight } from '../utils/adaptive';
import { TYPES } from '../utils/constants/typesConstants';
import PropTypes from 'prop-types';
import BaseListComponent from './BaseListComponent';

export default class SelectBucketComponent extends BaseListComponent {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        this.props.animatedScrollValue = this.animatedScrollValue;

        return(
            <View style = { styles.mainContainer }>
                <this.ListComponent
                    textComp = { (props) => <Text numberOfLines = { 1 } style = { props.style }>{ this.props.getBucketName(props.children) }</Text> }
                    listItemIcon = { require('../images/Icons/BucketListItemIcon.png') }
                    starredListItemIcon = { require('../images/Icons/ListStarredBucket.png') }
                    contentWrapperStyle = { styles.contentWrapper } />

                <BucketsScreenHeaderComponent
                    setDashboardBucketId = { () => {} }
                    isSelectBucketScreen = { true }
                    buckets = { this.props.buckets }
                    selectItem = { () => {} }
                    showOptions = { this.props.showOptions }
                    navigateBack = { this.props.navigateBack }
                    deselectItem = { () => {} }     
                    isSelectionMode = { false }
                    openedBucketId = { null }
                    animatedScrollValue = { this.animatedScrollValue }
                    enableSelectionMode = { () => {} }
                    disableSelectionMode = { () => {} }  
                    onSingleItemSelected = { () => {} }  
                    isSingleItemSelected = { () => {} } />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0, 
        bottom: 0,
        right: 0,
        left: 0
    },
    contentWrapper: {
        paddingTop: getHeight(58),
        paddingBottom: getHeight(60)
    }
});

SelectBucketComponent.propTypes = {
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