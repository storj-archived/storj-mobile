import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import React from 'react';
import BaseListComponent from "../Lists/BaseListComponent";
import { getHeight } from '../../utils/adaptive';
import PropTypes from 'prop-types';

export default class BucketsListComponent extends BaseListComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <this.ListComponent
                    textComp = { (props) => <Text numberOfLines = { 1 } style = { props.style }>{ this.props.getBucketName(props.children) }</Text> }
                    listItemIcon = { require('../../images/Icons/BucketListItemIcon.png') }
                    cloudListItemIcon = { require('../../images/Icons/CloudBucket.png') }
                    contentWrapperStyle = { styles.contentWrapper } />              
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
    onPress: PropTypes.func,
    refresh: PropTypes.func,
    selectBucket: PropTypes.func,
    selectedItemId: PropTypes.string,
    data: PropTypes.array,
    getBucketName: PropTypes.func,
    getItemSize: PropTypes.func,
    isLoading: PropTypes.bool,
    onCancelPress: PropTypes.func,
    onDotsPress: PropTypes.func,
    onLongPress: PropTypes.func,
    onRefresh: PropTypes.func,
    sortingMode: PropTypes.string
}