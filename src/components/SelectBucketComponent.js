import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../components/ListComponent';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import { getHeight } from '../utils/adaptive';
import { TYPES } from '../utils/constants/typesConstants';
import PropTypes from 'prop-types';

export default class SelectBucketComponent extends Component {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <ListComponent
                    onRefresh = { () => {} }
                    setSelectionId = { () => {} }
                    contentWrapperStyle = { styles.contentWrapper }
                    isGridViewShown = { this.props.isGridViewShown }
                    onPress = { (params) => { this.props.getBucketId(params) } }
                    itemType = { TYPES.REGULAR_BUCKET }
                    isSelectDisabled = { true }
                    selectedItemId = { null }
                    onSingleItemSelected = { this.props.onSingleItemSelected }                    
                    animatedScrollValue = { this.animatedScrollValue }
                    enableSelectionMode = { () => {} }
                    disableSelectionMode = { () => {} }
                    isSelectionMode = { false }
                    isSingleItemSelected = { false }
                    listItemIcon = { require('../images/Icons/BucketListItemIcon.png') }
                    starredListItemIcon = { require('../images/Icons/ListStarredBucket.png') }
                    starredGridItemIcon = { require('../images/Icons/GridStarredBucket.png') } 
                    deselectItem = { () => {} }
                    selectItem = { () => {} }
                    data = { this.props.buckets } /> 
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