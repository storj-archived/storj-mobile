import {
    View,
    StyleSheet
} from "react-native";
import React from "react";
import { getHeight } from "../utils/adaptive";
import FilesListComponent from "../components/FilesListComponent";
import BucketsScreenHeaderComponent from "../components/BucketsScreenHeaderComponent";
import PropTypes from 'prop-types';

export default class HeaderFilesListComponent extends FilesListComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                {
                    super.render()
                }
                <BucketsScreenHeaderComponent
                        lastSync = { this.props.lastSync }
                        navigateBack = { this.props.navigateBack }
                        buckets = { this.props.buckets }
                        isFilesScreen = { this.props.isFilesScreen }
                        placeholder = { this.props.placeholder }
                        selectedItemsCount = { this.props.getSelectedFilesCount }
                        showOptions = { this.props.showOptions }
                        isSelectionMode = { this.props.isSelectionMode }
                        disableSelectionMode = { this.props.disableSelectionMode }
                        animatedScrollValue = { this.props.animatedScrollValue }
                        setSearch = { this.props.setSearch }
                        clearSearch = { this.props.clearSearch }
                        searchIndex = { this.props.searchIndex }
                        openedBucketId = { this.props.bucketId }
                        selectAll = { this.props.selectAll }
                        deselectAll = { this.props.deselectAll }
                        searchSubSequence = { this.props.searchSubSequence } />
            </View>
        );
    }
}

HeaderFilesListComponent.propTypes = {
    bucketId: PropTypes.string,
    animatedScrollValue: PropTypes.object,
    bucketId: PropTypes.string,
    buckets: PropTypes.array,
    clearSearch: PropTypes.func,
    data: PropTypes.array,
    deselectAll: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    getFileName: PropTypes.func,
    getItemSize: PropTypes.func,
    getSelectedFilesCount: PropTypes.number,
    isFilesScreen: PropTypes.bool,
    isGridViewShown: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    navigateBack: PropTypes.func,
    onCancelPress: PropTypes.func,
    onDotsPress: PropTypes.func,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
    onRefresh: PropTypes.func,
    placeholder: PropTypes.string,
    searchIndex: PropTypes.number,
    selectAll: PropTypes.func,
    setSearch: PropTypes.func,
    showOptions: PropTypes.func,
    sortingMode: PropTypes.string
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentWrapper: {
        paddingTop: getHeight(58),
        paddingBottom: getHeight(60)
    },
    loadingComponentContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: getHeight(80),
        height: getHeight(60)
    }
});