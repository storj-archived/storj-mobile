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
import { dashboardContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { dashboardContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { dashboardNavigateBack, navigateToDashboardFilesScreen, navigateBack } from '../reducers/navigation/navigationActions';
import filesActions from '../reducers/mainContainer/Files/filesReducerActions';
import StorjModule from '../utils/StorjModule';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import ListItemModel from '../models/ListItemModel';
import FileModel from '../models/FileModel';
import ServiceModule from '../utils/ServiceModule';
import { TYPES } from '../utils/constants/typesConstants';
import { getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';
import EmpyBucketComponent from '../components/EmpyBucketComponent';

class FavoritesItemsContainer extends Component {
    constructor(props) {
        super(props);

        this.data = [];
        this.animatedScrollValue = new Animated.Value(0);
    }

    getData() {
        switch (this.props.navigation.state.params.itemType) {
            case TYPES.FILES: {
                this.data = this.props.files.filter((element) => {
                    return element.entity.isStarred === true;
                });
            } break;
            case TYPES.BUCKETS: {
                this.data = this.props.buckets.filter((element) => {
                    return element.entity.isStarred === true;
                }); 
            } break;
            case TYPES.SYNCED: {        
                this.data = this.props.files.filter((element) => {
                    return element.entity.isSynced === true;
                });
            } break;
            default : this.data = [];
        }

        return this.data;
    }

    getArraySelectedCount(array) {
        return array.filter(item => item.isSelected).length;
    }

    getSelectedItemsCount() {        
        return this.getArraySelectedCount(this.props.buckets.concat(this.props.files));
    }

    onPress(file) {        
        if(file.entity.isDownloaded) {
            this.props.openImageViewer(file.getId(), file.entity.localPath, file.entity.bucketId);
        }
    }

    isBuckets() {
        return this.props.navigation.state.params.itemType === TYPES.BUCKETS;
    }

    navigateBack() {
        this.props.dashboardNavigateBack();
        this.props.disableSelectionMode();
        this.props.setDashboardBucketId(null);
    }

    render() {
        let data = this.getData();

        return (
            <View style = { styles.mainContainer }>
                {
                    data.length !== 0 ? 
                        <ListComponent                   
                            contentWrapperStyle = { styles.contentWrapper }
                            searchSubSequence = { this.props.searchSubSequence }
                            setSelectionId = { this.props.setSelectionId }
                            selectedItemId = { this.props.selectedItemId }
                            cancelDownload = { this.props.cancelDownload }
                            cancelUpload = { this.props.cancelUpload }
                            isGridViewShown = { this.props.isGridViewShown }
                            onPress = { (params) => { this.onPress(params); } }
                            onRefresh = { () => {} }
                            itemType = { this.isBuckets() ? TYPES.REGULAR_BUCKET : TYPES.REGULAR_FILE }
                            bucketId = { this.props.bucketId }
                            isGridViewShown = { this.props.isGridViewShown }
                            onSingleItemSelected = { this.props.onSingleItemSelected }                    
                            animatedScrollValue = { this.props.animatedScrollValue }
                            enableSelectionMode = { this.props.enableSelectionMode }
                            disableSelectionMode = { this.props.disableSelectionMode }
                            isSelectionMode = { this.props.isSelectionMode }
                            isSingleItemSelected = { this.props.isSingleItemSelected }
                            deselectItem = { this.isBuckets() ? this.props.deselectBucket : this.props.deselectFile }
                            selectItem = { this.isBuckets() ? this.props.selectBucket : this.props.selectFile } 
                            data = { data }   
                            sortingMode = { this.props.sortingMode }
                            listItemIcon = { 
                                this.isBuckets() 
                                ? require('../images/Icons/BucketListItemIcon.png')
                                : require('../images/Icons/FileListItemIcon.png')
                            }
                            starredGridItemIcon = { 
                                this.isBuckets() 
                                ? require('../images/Icons/GridStarredBucket.png') 
                                : require('../images/Icons/GridStarredFile.png') 
                            }
                            starredListItemIcon = { 
                                this.isBuckets() 
                                ? require('../images/Icons/ListStarredBucket.png') 
                                : require('../images/Icons/ListStarredFile.png') 
                            } />
                            : <EmpyBucketComponent />
                }
                <BucketsScreenHeaderComponent
                    setDashboardBucketId = { this.props.setDashboardBucketId }
                    setSearch = { this.props.setSearch }
                    clearSearch = { this.props.clearSearch }
                    searchIndex = { 3 }  
                    isFilesScreen = { true }
                    buckets = { this.props.buckets }
                    screenName = { this.props.screenName }
                    selectItem = { this.props.selectItem }
                    showOptions = { this.props.screenProps.showOptions }
                    navigateBack = { () => { this.navigateBack() } }
                    deselectItem = { this.props.deselectItem }     
                    isSelectionMode = { this.props.isSelectionMode }
                    openedBucketId = { this.props.selectedBucketId }
                    animatedScrollValue = { this.animatedScrollValue }
                    enableSelectionMode = { this.props.enableSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    selectedItemsCount = { this.getSelectedItemsCount() }  
                    onSingleItemSelected = { this.props.onSingleItemSelected }  
                    isSingleItemSelected = { this.props.isSingleItemSelected } />
            </View>
        )
    }
}

function mapStateToProps(state) {
    let routes = state.dashboardScreenNavReducer.routes;
    let index = state.dashboardScreenNavReducer.index;
    let currentScreenName = routes[index].routeName;  

    return {
        buckets: state.bucketReducer.buckets,
        files: state.filesReducer.fileListModels,
        selectedItemId: state.mainReducer.selectedItemId,
        mainNavReducer: state.navReducer,
        dashboardBucketId: state.mainReducer.dashboardBucketId,
        isActionBarShown: state.mainReducer.isActionBarShown,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,
        activeScreen: state.mainReducer.activeScreen,
        sortingMode: state.mainReducer.sortingMode,
        isFirstSignIn: state.mainReducer.isFirstSignIn,
        defaultRoute: routes[0].routeName,
        screenName: currentScreenName,
        selectedBucketId: state.mainReducer.dashboardBucketId,
        searchSubSequence: state.mainReducer.starredSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  
        openImageViewer,
        ...myPicturesListContainerMainActions, 
        ...filesActions,...dashboardContainerActions, 
        ...dashboardContainerBucketActions,
        ...filesListContainerMainActions, 
        ...filesListContainerFileActions, 
        dashboardNavigateBack,
        navigateToDashboardFilesScreen,
        navigateBack
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesItemsContainer);

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