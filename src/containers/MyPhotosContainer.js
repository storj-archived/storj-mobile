import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ListComponent from '../components/ListComponent';
import { openImageViewer } from '../reducers/navigation/navigationActions';
import { myPicturesListContainerMainActions, getPicturesBucketId } from '../reducers/mainContainer/mainReducerActions';
import filesActions from '../reducers/mainContainer/Files/filesReducerActions';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import StorjModule from '../utils/StorjModule';
import ListItemModel from '../models/ListItemModel';
import FileModel from '../models/FileModel';
import ServiceModule from '../utils/ServiceModule';
import { TYPES } from '../utils/constants/typesConstants';
import { getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';
import EmpyBucketComponent from '../components/EmpyBucketComponent';

class MyPhotosContainer extends Component {
    constructor(props) {
        super(props);

        console.log(this.props)

        this.data = [];
        this.animatedScrollValue = new Animated.Value(0);
        this.shouldRenew = false;
    }

    getData() {
        let picturesBucketId = getPicturesBucketId(this.props.buckets);
        
        
        if(this.props.openedBucketId === picturesBucketId && !this.shouldRenew) {
            ServiceModule.getFiles(picturesBucketId); 
            this.data = this.props.files.filter(element => element.entity.bucketId === picturesBucketId);
        }

        this.shouldRenew = this.props.openedBucketId === picturesBucketId;

        return this.data;
    }

    getArraySelectedCount(array) {
        return array.filter(item => item.isSelected).length;
    }

    getSelectedFilesCount() {        
        if(!this.props.openedBucketId || !this.props.files || this.props.files.length === 0) return 0; 

        let openedBucket = this.props.files.filter(item => item.entity.bucketId === this.props.openedBucketId);

        if(openedBucket) {
            return this.getArraySelectedCount(openedBucket);
        }
    }

    render() {
        let data = this.getData();

        return (
            <View style = { styles.mainContainer }>
            {
                data.length !== 0 ? 
                    <ListComponent
                        contentWrapperStyle = { styles.contentWrapper }
                        setSelectionId = { this.props.setSelectionId }
                        selectedItemId = { this.props.selectedItemId }
                        cancelDownload = { this.props.cancelDownload }
                        cancelUpload = { this.props.cancelUpload }
                        isGridViewShown = { this.props.isGridViewShown }
                        onPress = { () => {} }
                        onRefresh = { () => ServiceModule.getFiles(this.props.openedBucketId) }
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
                        data = { data }   
                        listItemIcon = { require('../images/Icons/FileListItemIcon.png') }
                        starredGridItemIcon = { require('../images/Icons/GridStarredFile.png') }
                        starredListItemIcon = { require('../images/Icons/ListStarredFile.png') } />
                    : <EmpyBucketComponent />
            }
                <BucketsScreenHeaderComponent
                    selectedItemsCount = { this.getSelectedFilesCount() }
                    showOptions = { this.props.screenProps.showOptions }
                    isSelectionMode = { this.props.isSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    animatedScrollValue = { this.animatedScrollValue }
                    openedBucketId = { this.props.openedBucketId } />
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        buckets: state.mainReducer.buckets,
        files: state.filesReducer.fileListModels,
        selectedItemId: state.mainReducer.selectedItemId,
        mainNavReducer: state.navReducer,
        openedBucketId: state.mainReducer.openedBucketId,
        isActionBarShown: state.mainReducer.isActionBarShown,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        fileListModels: state.filesReducer.fileListModels,
        uploadingFileListModels: state.filesReducer.uploadingFileListModels,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,
        downloadedFileListModels: state.filesReducer.downloadedFileListModels,
        selectedItemId: state.mainReducer.selectedItemId
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  
        openImageViewer, 
        ...myPicturesListContainerMainActions, 
        ...filesActions 
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPhotosContainer);

MyPhotosContainer.propTypes = {
    setSelectionId: PropTypes.func,
    selectedItemId: PropTypes.bool,
    cancelDownload: PropTypes.bool,
    cancelUpload: PropTypes.bool,
    isGridViewShown: PropTypes.bool,
    openedBucketId: PropTypes.string,
    bucketId: PropTypes.bool,
    onSingleItemSelected: PropTypes.func,
    animatedScrollValue: PropTypes.bool,
    enableSelectionMode: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    deselectFile: PropTypes.func,
    selectFile: PropTypes.func
};


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