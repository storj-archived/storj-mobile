import React, { Component } from 'react';
import { Animated } from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openImageViewer } from '../reducers/navigation/navigationActions';
import { myPicturesListContainerMainActions, getPicturesBucketId } from '../reducers/mainContainer/mainReducerActions';
import filesActions from '../reducers/mainContainer/Files/filesReducerActions';
import headerFilesListBinder from "../viewBinders/headerFilesListBinder";
import BaseFilesListContainer from '../containers/BaseFilesListContainer';
import PropTypes from 'prop-types';

/** 
 * My photos screen, base screen, could be found in tab bar
*/
class MyPhotosContainer extends BaseFilesListContainer {
    constructor(props) {
        super(props);
        
        this.animatedScrollValue = new Animated.Value(0);
        /**
         * FileListComponent with header that is binded to 
         * default props of this FileListContainer
         */
        this.HeaderFilesListComponent = headerFilesListBinder.call(this);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.activeScreen === "MyPhotosScreen";
    }

    render() {
        let data = this.getData();

        return (
            <this.HeaderFilesListComponent
                isLoading = { this.props.loadingStack.includes(this.props.bucketId) }                            
                data = { data }
                animatedScrollValue = { this.animatedScrollValue }
                placeholder = { "Pictures" }
                isFilesScreen = { false }
                searchIndex = { 0 }
                navigateBack = { () => {} }
                selectAll = { this.props.screenProps.selectAll }
                deselectAll = { this.props.screenProps.deselectAll } />
        );
    }
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName;

    return {
        loadingStack: state.mainReducer.loadingStack,
        buckets: state.bucketReducer.buckets,        
        fileListModels: state.filesReducer.fileListModels,
        selectedItemId: state.mainReducer.selectedItemId,
        bucketId: state.mainReducer.myPhotosBucketId,        
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        uploadingFileListModels: state.filesReducer.uploadingFileListModels,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,        
        sortingMode: state.mainReducer.sortingMode,
        activeScreen: currentScreenName,        
        searchSubSequence: state.mainReducer.myPhotosSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ openImageViewer, ...myPicturesListContainerMainActions, ...filesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPhotosContainer);

MyPhotosContainer.propTypes = {
    activeScreen: PropTypes.string,
    searchSubSequence: PropTypes.string,
    sortingMode: PropTypes.string,
    setSelectionId: PropTypes.func,
    selectedItemId: PropTypes.string,
    isGridViewShown: PropTypes.bool,
    bucketId: PropTypes.string,    
    onSingleItemSelected: PropTypes.func,
    animatedScrollValue: PropTypes.bool,
    enableSelectionMode: PropTypes.func,
    disableSelectionMode: PropTypes.func,    
    isSingleItemSelected: PropTypes.bool,
    deselectFile: PropTypes.func,
    selectFile: PropTypes.func,
    fileListModels: PropTypes.array,        
    isLoading: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,        
    screenProps: PropTypes.object,
    uploadingFileListModels: PropTypes.array
};