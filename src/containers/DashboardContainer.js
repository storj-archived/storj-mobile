import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setDashboardBucketId } from '../reducers/mainContainer/mainReducerActions';
import { navigateToDashboardFilesScreen, redirectToFavoriteBucketsScreen, redirectToFavoriteFilesScreen } from '../reducers/navigation/navigationActions';
import { uploadFileStart, uploadFileSuccess } from '../reducers/asyncActions/fileActionsAsync';
import { listSyncQueueEntriesAsync, updateSyncQueueEntryFileNameAsync, updateSyncQueueEntryStatusAsync } from "../reducers/mainContainer/SyncQueue/syncQueueReducerAsyncActions";
import DashboardListComponent from '../components/Dashboard/DashboardListComponent';

class DashboardContainer extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.activeScreen === "DashboardScreen";
    }

    getProgress(fileHandle) {
        let uploadingFile = this.props.uploadingFiles.find(uploadingFile => fileHandle);

        if(uploadingFile) {
            return uploadingFile.progress;
        }

        return 0;
    }

    render() {     
        return(
            <DashboardListComponent
                syncQueueEntries = { this.props.syncQueueEntries }
                listSyncQueueEntriesAsync = { this.props.listSyncQueueEntriesAsync }
                updateSyncQueueEntryFileNameAsync = { this.props.updateSyncQueueEntryFileNameAsync }
                updateSyncQueueEntryStatusAsync = { this.props.updateSyncQueueEntryStatusAsync }
                getProgress = { this.getProgress.bind(this) }
            
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
                redirectToFavoriteFilesScreen = { this.props.redirectToFavoriteFilesScreen } />
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
            updateSyncQueueEntryStatusAsync
        }, dispatch),
        getUploadingFile: (fileHandle) => dispatch(uploadFileStart(fileHandle)),
        uploadSuccess: (fileHandle, fileId) => dispatch(uploadFileSuccess(fileHandle, fileId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);