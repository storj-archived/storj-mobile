import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dashboardContainerActions, filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { dashboardContainerBucketActions } from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { filesListContainerFileActions, mainContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { navigateBack, navigateToDashboardFilesScreen } from '../reducers/navigation/navigationActions';
import { uploadFileStart, uploadFileSuccess } from '../reducers/asyncActions/fileActionsAsync';
import BucketModel from '../models/BucketModel';
import FileModel from '../models/FileModel';
import ListItemModel from '../models/ListItemModel';
import DashboardListComponent from '../components/Dashboard/DashboardListComponent';

class DashboardContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {        
        return(
            <DashboardListComponent
                files = { this.props.files }
                buckets = { this.props.buckets }
                openBucket = { this.props.openBucket}
                screenName = { this.props.screenName }
                selectItem = { this.props.selectBucket }
                navigateBack = { this.props.navigateBack }
                deselectItem = { this.props.deselectBucket }      
                isSelectionMode = { this.props.isSelectionMode }
                openedBucketId = { this.props.openedBucketId }
                selectedItemId = { this.props.selectedItemId }
                animatedScrollValue = { this.animatedScrollValue  }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                onSingleItemSelected = { this.props.onSingleItemSelected }  
                isSingleItemSelected = { this.props.isSingleItemSelected }
                navigateToFilesScreen = { this.props.navigateToFilesScreen }
                setSelectionId = { this.props.setSelectionId } 
                storageAmount = { this.props.storage }
                bandwidthAmount = { this.props.bandwidth } 
                navigateToDashboardFilesScreen = { this.props.navigateToDashboardFilesScreen }
                setSelectionId = { this.props.setSelectionId } />
        )
    }
}

function mapStateToProps(state) {
    let routes = state.dashboardScreenNavReducer.routes;
    let index = state.dashboardScreenNavReducer.index;
    let currentBucketScreenName = routes[index].routeName;

    return {
        isSelectionMode: state.mainReducer.isSelectionMode,        
        buckets: state.bucketReducer.buckets,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        fileListModels: state.filesReducer.fileListModels,
        files: state.filesReducer.fileListModels,
        screenName: currentBucketScreenName,
        selectedItemId: state.mainReducer.selectedItemId,
        openedBucketId: state.mainReducer.openedBucketId,
        storage: state.billingReducer.storage,
        bandwidth: state.billingReducer.bandwidth
    };
}
    
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators( { 
            ...dashboardContainerActions, 
            ...dashboardContainerBucketActions,
            ...filesListContainerFileActions, 
            ...filesListContainerMainActions, 
            navigateBack,
            navigateToDashboardFilesScreen
        }, dispatch),
        getUploadingFile: (fileHandle) => dispatch(uploadFileStart(fileHandle)),
        uploadSuccess: (fileHandle, fileId) => dispatch(uploadFileSuccess(fileHandle, fileId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);