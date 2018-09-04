import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setDashboardBucketId } from '../reducers/mainContainer/mainReducerActions';
import { navigateToDashboardFilesScreen, redirectToFavoriteBucketsScreen, redirectToFavoriteFilesScreen, redirectToRecentSyncFilesScreen } from '../reducers/navigation/navigationActions';
import { uploadFileStart, uploadFileSuccess } from '../reducers/asyncActions/fileActionsAsync';
import { listSyncQueueEntriesAsync, updateSyncQueueEntryFileNameAsync, updateSyncQueueEntryStatusAsync } from "../reducers/mainContainer/SyncQueue/syncQueueReducerAsyncActions";
import { getAllFromCode } from "../utils/syncQueue/syncStatusMapper";
import SyncQueueCallbackObject from "../models/SyncQueueCallbackObject";
import DashboardListComponent from '../components/Dashboard/DashboardListComponent';
import SyncQueueEntryComponent from "../components/SynQueue/SyncQueueEntryComponent";
import ServiceModule from '../utils/ServiceModule';
import StorjModule from '../utils/StorjModule';
import SyncState from '../utils/constants/SyncState';

class DashboardContainer extends Component {
    constructor(props) {
        super(props);

        let callbackOject = {};
        let reSyncCallback = (entry) => this.props.updateSyncQueueEntryStatusAsync(entry.getId(), SyncState.IDLE);

        callbackOject.queued = (entry) => ServiceModule.removeFileFromSyncQueue(entry.getId()); 
        callbackOject.error = reSyncCallback;
        callbackOject.cancelled = reSyncCallback;
        callbackOject.processing = (entry) => StorjModule.cancelUpload(entry.entity.fileHandle);
        callbackOject.processed = reSyncCallback;
        callbackOject.idle = (entry) => this.props.updateSyncQueueEntryStatusAsync(entry.getId(), SyncState.CANCELLED);

        //SyncQueueCallbackObject.CallbackObject = callbackOject;
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.activeScreen === "DashboardScreen";
    }

    getProgress(fileHandle) {
        let uploadingFile = this.props.uploadingFiles.find(uploadingFile => uploadingFile.getId() === fileHandle);

        if(uploadingFile) {
            return uploadingFile.progress;
        }

        return 0;
    }

    getSyncQueueEntries() {
        return this.props.syncQueueEntries.map((entry) => this.getSyncQueueEntry(entry));
    }

    getSyncQueueEntry(entry) {
        const describer = getAllFromCode(entry.entity.status, new SyncQueueCallbackObject(entry));

        return(
            <SyncQueueEntryComponent key = { entry.getId() }
                error = { describer.error }
                fileName = { entry.getName() }
                iconSource = { require("../images/Icons/CloudFile.png") }
                actionIconSource = { describer.actionIcon }
                actionCallback = { describer.action }
                isLoading = { describer.isLoading }
                progress = { this.getProgress(entry.entity.fileHandle) }
                status = { describer.status } />
        );
    }

    render() {
        return(
            <DashboardListComponent
                syncQueueEntries = { this.getSyncQueueEntries() }
                listSyncQueueEntriesAsync = { this.props.listSyncQueueEntriesAsync }
                updateSyncQueueEntryFileNameAsync = { this.props.updateSyncQueueEntryFileNameAsync }
                updateSyncQueueEntryStatusAsync = { this.props.updateSyncQueueEntryStatusAsync }
            
                activeScreen = { this.props.activeScreen }
                files = { this.props.files }
                buckets = { this.props.buckets }
                setDashboardBucketId = { this.props.setDashboardBucketId } 
                dashboardBucketId = { this.props.dashboardBucketId }
                animatedScrollValue = { this.animatedScrollValue  } 
                storageAmount = { this.props.storage }
                bandwidthAmount = { this.props.bandwidth } 
                navigateToDashboardFilesScreen = { this.props.navigateToDashboardFilesScreen }
                redirectToFavoriteBucketsScreen = { this.props.redirectToFavoriteBucketsScreen }
                redirectToFavoriteFilesScreen = { this.props.redirectToFavoriteFilesScreen }
                redirectToRecentSyncFilesScreen = { this.props.redirectToRecentSyncFilesScreen } />
        )
    }
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName;

    return {
        syncQueueEntries: state.syncQueueReducer.syncQueueEntries,   
        buckets: state.bucketReducer.buckets,
        files: state.filesReducer.fileListModels,
        uploadingFiles: state.filesReducer.uploadingFileListModels,
        dashboardBucketId: state.mainReducer.dashboardBucketId,
        storage: state.billingReducer.storage,
        bandwidth: state.billingReducer.bandwidth,
        activeScreen: currentScreenName
    };
}
   
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators( { 
            setDashboardBucketId,   
            redirectToFavoriteBucketsScreen,
            redirectToFavoriteFilesScreen,
            navigateToDashboardFilesScreen,
            listSyncQueueEntriesAsync,
            updateSyncQueueEntryFileNameAsync,
            updateSyncQueueEntryStatusAsync,
            redirectToRecentSyncFilesScreen
        }, dispatch),
        getUploadingFile: (fileHandle) => dispatch(uploadFileStart(fileHandle)),
        uploadSuccess: (fileHandle, fileId) => dispatch(uploadFileSuccess(fileHandle, fileId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);