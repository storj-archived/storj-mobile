import React from "react";
import { getFileSize, getFullFileName, getShortFileName } from "../utils/fileUtils";
import HeaderFilesListComponent from "../components/HeaderFilesListComponent";

export default function headerFilesListBinder() {
    return (props) => (
        <HeaderFilesListComponent
                isLoading = { props.isLoading }
                data = { props.data }
                animatedScrollValue = { props.animatedScrollValue }
                getItemSize = { getFileSize }
                getFileName = { this.props.isGridViewShown ? getShortFileName : getFullFileName }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (item) => { this.onPress(item); } }
                onLongPress = { (item) => { this.onLongPress(item); } }
                onDotsPress = { (item) => { this.onDotsPress(item); } }
                onCancelPress = { (item) => { this.onCancelPress(item); } }                             
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                sortingMode = { this.props.sortingMode }
                searchSubSequence = { this.props.searchSubSequence }
                onRefresh = { this.onRefresh.bind(this) }

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