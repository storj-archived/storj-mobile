import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import BucketsScreenNavigation from '../containers/BucketsScreenNavContainer';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import PropTypes from 'prop-types';

export default class BucketsComponent extends Component {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <BucketsScreenNavigation
                    animatedScrollValue = { this.animatedScrollValue }
                    setSelectionId = { this.props.setSelectionId }
                    selectedItemId = { this.props.selectedItemId }  />
                <BucketsScreenHeaderComponent
                    lastSync = { this.props.lastSync }
                    selectAll = { this.props.selectAll }
                    deselectAll = { this.props.deselectAll }
                    setSearch = { this.props.setSearch }
                    clearSearch = { this.props.clearSearch }
                    searchIndex = { this.props.searchIndex } 
                    isFilesScreen = { this.props.isFilesScreen }
                    selectedItemsCount = { this.props.selectedItemsCount }
                    showOptions = { this.props.showOptions }
                    isSelectionMode = { this.props.isSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    animatedScrollValue = { this.animatedScrollValue }
                    navigateBack = { this.props.navigateBack }
                    buckets = { this.props.buckets }
                    openedBucketId = { this.props.openedBucketId } />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});

BucketsComponent.propTypes = {
    buckets: PropTypes.array,
    deselectBucket: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    enableSelectionMode: PropTypes.func,
    files: PropTypes.array,
    isFilesScreen: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    navigateBack: PropTypes.func,
    openedBucketId: PropTypes.string,
    selectBucket: PropTypes.func,
    selectedItemId: PropTypes.string,
    selectedItemsCount: PropTypes.number,
    setSelectionId: PropTypes.func,
    showOptions: PropTypes.func
}