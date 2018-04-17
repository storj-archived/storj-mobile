import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ListComponent from '../components/ListComponent';
import { openImageViewer } from '../reducers/navigation/navigationActions';
import { myPicturesListContainerMainActions, getPicturesBucketId } from '../reducers/mainContainer/mainReducerActions';
import filesActions from '../reducers/mainContainer/Files/filesReducerActions';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import { TYPES } from '../utils/constants/typesConstants';
import { getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';
import EmpyBucketComponent from '../components/EmpyBucketComponent';
import BaseFileListContainer from '../containers/BaseFileListContainer';

/** 
 * My photos screen, base screen, could be found in tab bar
*/
class MyPhotosContainer extends BaseFileListContainer {
    constructor(props) {
        super(props);
        
        this.animatedScrollValue = new Animated.Value(0);
        this.shouldRenew = true;
    }    

    /** 
     * Set initial data upload from Storj Network when screen is loaded
    */
    shouldComponentUpdate() {
        if(!this.shouldRenew) return true;
        if(!this.props.bucketId) return true;
        
        this.onRefresh();      

        this.shouldRenew = false;        

        return true;
    }    

    getArraySelectedCount(array) {
        return array.filter(item => item.isSelected).length;
    }

    getSelectedFilesCount() {        
        if(!this.props.bucketId || !this.props.fileListModels || this.props.fileListModels.length === 0) return 0; 

        let openedBucket = this.props.fileListModels.filter(item => item.entity.bucketId === this.props.bucketId);

        if(openedBucket) {
            return this.getArraySelectedCount(openedBucket);
        }
    }

    render() {
        let data = this.getData();

        let isLoading = this.props.loadingStack.includes(this.props.bucketId);
 
        return (
            <View style = { styles.mainContainer }>
            {
               data.length === 0 
               && this.props.bucketId !== null && !isLoading
                   ? <EmpyBucketComponent />
                   : <ListComponent
                        activeScreen = { this.props.activeScreen }
                        screens = { "MyPhotosScreen" }              
                        contentWrapperStyle = { styles.contentWrapper }
                        setSelectionId = { this.props.setSelectionId }
                        selectedItemId = { this.props.selectedItemId }
                        cancelDownload = { (params) => { this.cancelDownload(params); }}
                        cancelUpload = { (params) => { this.cancelUpload(params); }}
                        isGridViewShown = { this.props.isGridViewShown }
                        onPress = { (params) => { this.onPress(params); } }
                        onRefresh = { this.onRefresh.bind(this) }
                        itemType = { TYPES.REGULAR_FILE }
                        bucketId = { this.props.bucketId }
                        onSingleItemSelected = { this.props.onSingleItemSelected }                    
                        animatedScrollValue = { this.animatedScrollValue }
                        enableSelectionMode = { this.props.enableSelectionMode }
                        disableSelectionMode = { this.props.disableSelectionMode }
                        isSelectionMode = { this.props.isSelectionMode }
                        isSingleItemSelected = { this.props.isSingleItemSelected }
                        deselectItem = { this.props.deselectFile }
                        selectItem = { this.props.selectFile }
                        data = { data }   
                        sortingMode = { this.props.sortingMode }
                        searchSubSequence = { this.props.searchSubSequence }
                        listItemIcon = { require('../images/Icons/FileListItemIcon.png') }
                        starredGridItemIcon = { require('../images/Icons/GridStarredFile.png') }
                        starredListItemIcon = { require('../images/Icons/ListStarredFile.png') } />
            }
                <LoadingComponent isLoading = { isLoading } /> 
                
                <BucketsScreenHeaderComponent
                    buckets = { this.props.buckets }
                    isFilesScreen = { false }
                    placeholder = { 'Pictures' }
                    selectedItemsCount = { this.getSelectedFilesCount() }
                    showOptions = { this.props.screenProps.showOptions }
                    isSelectionMode = { this.props.isSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    animatedScrollValue = { this.animatedScrollValue }
                    setSearch = { this.props.setSearch }
                    clearSearch = { this.props.clearSearch }
                    searchIndex = { 0 }
                    openedBucketId = { this.props.bucketId } />
            </View>
        )
    }
}

const LoadingComponent = (props) => {
    return (
        <View style = { styles.loadingComponentContainer }>
            <ActivityIndicator animating = { true } size = { 'large' } color = { 'blue' } style={{ opacity: props.isLoading ? 1.0 : 0.0 }} />
        </View>
    ); 
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