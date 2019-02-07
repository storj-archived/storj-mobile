import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React from 'react';
import BucketsScreenNavigation from '../../containers/Buckets/BucketsScreenNavContainer';
import BucketsScreenHeaderComponent from '../Header/BucketsScreenHeaderComponent';
import PropTypes from 'prop-types';

export default BucketsComponent = (props) => {

    const animatedScrollValue = new Animated.Value(0);

    return(
        <View style={ styles.mainContainer }>
            <BucketsScreenNavigation
                animatedScrollValue = { animatedScrollValue }
                setSelectionId = { props.setSelectionId }
                selectedItemId = { props.selectedItemId }  />
            <BucketsScreenHeaderComponent
                lastSync = { props.lastSync }
                searchSubSequence = { props.searchSubSequence }
                selectAll = { props.selectAll }
                deselectAll = { props.deselectAll }
                setSearch = { props.setSearch }
                clearSearch = { props.clearSearch }
                searchIndex = { props.searchIndex } 
                isFilesScreen = { props.isFilesScreen }
                selectedItemsCount = { props.selectedItemsCount }
                showOptions = { props.showOptions }
                isSelectionMode = { props.isSelectionMode }
                disableSelectionMode = { props.disableSelectionMode }
                animatedScrollValue = { animatedScrollValue }
                navigateBack = { props.navigateBack }
                buckets = { props.buckets }
                openedBucketId = { props.openedBucketId } />
        </View>
    );
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
    showOptions: PropTypes.func,
    clearSearch: PropTypes.func,
    deselectAll: PropTypes.func,
    searchIndex: PropTypes.number,
    selectAll: PropTypes.func,
    setSearch: PropTypes.func
};