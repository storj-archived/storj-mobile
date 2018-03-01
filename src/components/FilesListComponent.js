import {
    View,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../components/ListComponent';
import { TYPES } from '../utils/constants/typesConstants';

export default class FilesListComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.data);
        return(
            <View style = { styles.mainContainer }>
                <ListComponent
                    cancelDownload = { this.props.cancelDownload }
                    cancelUpload = { this.props.cancelUpload }
                    isGridViewShown = { this.props.isGridViewShown }
                    onPress = { this.props.onPress }
                    itemType = { TYPES.REGULAR_FILE }
                    bucketId = { this.props.bucketId }
                    onSingleItemSelected = { this.props.onSingleItemSelected }                    
                    animatedScrollValue = { this.props.animatedScrollValue }
                    enableSelectionMode = { this.props.enableSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    isSelectionMode = { this.props.isSelectionMode }
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    deselectItem = { this.props.deselectFile }
                    selectItem = { this.props.selectFile }
                    data = { this.props.data }   
                    listItemIcon = { require('../images/Icons/FileListItemIcon.png') } />
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