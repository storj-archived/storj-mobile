import {
    View,
    StyleSheet
} from "react-native";
import React from "react";
import { getHeight } from "../utils/adaptive";
import FilesListComponent from "../components/FilesListComponent";
import BucketsScreenHeaderComponent from "../components/BucketsScreenHeaderComponent";

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