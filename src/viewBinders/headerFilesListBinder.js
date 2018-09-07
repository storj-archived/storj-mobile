import React from "react";
import { getFileSize, getFullFileName, getShortFileName } from "../utils/fileUtils";
import HeaderFilesListComponent from "../components/HeaderFilesListComponent";

//TODO: remove arrow
export default function headerFilesListBinder() {
    return (props) => (
        <HeaderFilesListComponent
                lastSync = { this.props.lastSync }
                isLoading = { props.isLoading }
                data = { props.data }
                animatedScrollValue = { props.animatedScrollValue }
                getItemSize = { getFileSize }
                getFileName = { this.props.isGridViewShown ? getShortFileName : getFullFileName }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { this.onPress }
                onLongPress = { this.onLongPress }
                onDotsPress = { this.onDotsPress }
                onCancelPress = { this.onCancelPress }                             
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                sortingMode = { this.props.sortingMode }
                searchSubSequence = { this.props.searchSubSequence }
                onRefresh = { this.onRefresh }

                selectAll = { props.selectAll }
                deselectAll = { props.deselectAll }
                placeholder = { props.placeholder }
                isFilesScreen = { props.isFilesScreen }
                searchIndex = { props.searchIndex }
                navigateBack = { props.navigateBack }
                buckets = { this.props.buckets ? this.props.buckets : [] }
                bucketId = { this.props.bucketId }
                setSearch = { this.props.setSearch }
                clearSearch = { this.props.clearSearch }
                disableSelectionMode = { this.props.disableSelectionMode }
                showOptions = { this.props.screenProps.showOptions }
                getSelectedFilesCount = { this.getSelectedItemsCount(props.data) } />
    );
}