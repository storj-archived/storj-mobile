import {
    View,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../components/ListComponent';
import { getHeight } from '../utils/adaptive';
import { TYPES } from '../utils/constants/typesConstants';
import EmpyBucketComponent from '../components/EmpyBucketComponent';

export default class FilesListComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                {
                    this.props.data.length === 0 
                    && this.props.openedBucketId !== null
                        ? <EmpyBucketComponent />
                        : <ListComponent
                            contentWrapperStyle = { styles.contentWrapper }
                            setSelectionId = { this.props.setSelectionId }
                            selectedItemId = { this.props.selectedItemId }
                            cancelDownload = { this.props.cancelDownload }
                            cancelUpload = { this.props.cancelUpload }
                            isGridViewShown = { this.props.isGridViewShown }
                            onPress = { this.props.onPress }
                            onRefresh = { this.props.renewFileList }
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
                            listItemIcon = { require('../images/Icons/FileListItemIcon.png') }
                            starredGridItemIcon = { require('../images/Icons/GridStarredFile.png') }
                            starredListItemIcon = { require('../images/Icons/ListStarredFile.png') } />                       
                }               
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        //paddingBottom: getHeight(60)
    },
    contentWrapper: {
        paddingTop: getHeight(58),
        paddingBottom: getHeight(60)
    }
});