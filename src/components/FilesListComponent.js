import {
    View,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../components/ListComponent';
import { getHeight } from '../utils/adaptive';
import { TYPES } from '../utils/constants/typesConstants';
import EmpyBucketComponent from '../components/EmpyBucketComponent';
import PropTypes from 'prop-types';

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
                            activeScreen = { this.props.activeScreen }
                            screens = { "BucketsScreen" }
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
        backgroundColor: 'white'
    },
    contentWrapper: {
        paddingTop: getHeight(58),
        paddingBottom: getHeight(60)
    }
});

FilesListComponent.propTypes = {
    activeScreen: PropTypes.string,
    animatedScrollValue: PropTypes.object,
    bucketId: PropTypes.string,
    cancelDownload: PropTypes.func,
    cancelUpload: PropTypes.func,
    data: PropTypes.array,
    deselectFile: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    enableSelectionMode: PropTypes.func,
    isGridViewShown: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    onPress: PropTypes.func,
    onSingleItemSelected: PropTypes.func,
    openedBucketId: PropTypes.string,
    renewFileList: PropTypes.func,
    selectFile: PropTypes.func,
    selectedItemId: PropTypes.string,
    setSelectionId: PropTypes.func
};