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
                activeScreen = { this.props.activeScreen }
                files = { this.props.files }
                buckets = { this.props.buckets }
                setDashboardBucketId = { this.props.setDashboardBucketId }
                screenName = { this.props.screenName }
                selectItem = { this.props.selectBucket }
                navigateBack = { this.props.navigateBack }
                deselectItem = { this.props.deselectBucket }      
                isSelectionMode = { this.props.isSelectionMode }
                dashboardBucketId = { this.props.dashboardBucketId }
                selectedItemId = { this.props.selectedItemId }
                animatedScrollValue = { this.animatedScrollValue  }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                onSingleItemSelected = { this.props.onSingleItemSelected }  
                isSingleItemSelected = { this.props.isSingleItemSelected }
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
        dashboardBucketId: state.mainReducer.dashboardBucketId,
        storage: state.billingReducer.storage,
        bandwidth: state.billingReducer.bandwidth,
        activeScreen: state.mainReducer.activeScreen
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