import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setDashboardBucketId } from '../reducers/mainContainer/mainReducerActions';
import { navigateToDashboardFilesScreen, redirectToFavoriteBucketsScreen, redirectToFavoriteFilesScreen } from '../reducers/navigation/navigationActions';
import { uploadFileStart, uploadFileSuccess } from '../reducers/asyncActions/fileActionsAsync';
import DashboardListComponent from '../components/Dashboard/DashboardListComponent';

class DashboardContainer extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.activeScreen === "DashboardScreen";
    }

    render() {     
        return(
            <DashboardListComponent                
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
        buckets: state.bucketReducer.buckets,
        files: state.filesReducer.fileListModels,
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
            navigateToDashboardFilesScreen
        }, dispatch),
        getUploadingFile: (fileHandle) => dispatch(uploadFileStart(fileHandle)),
        uploadSuccess: (fileHandle, fileId) => dispatch(uploadFileSuccess(fileHandle, fileId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);