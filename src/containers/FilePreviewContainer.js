import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TabBarActionModelFactory from '../models/TabBarActionModel';
import FilePreviewComponent from "../components/FilePreviewComponent";
import BaseFileViewerContainer from '../containers/BaseFileViewerContainer';
import { redirectToMainScreen } from '../reducers/navigation/navigationActions';
import { imageViewerActions } from '../reducers/mainContainer/Files/filesReducerActions';
import OpenFileModule from '../utils/OpenFileModule';
import { getFileSize } from "../utils/fileUtils";
import SyncModule from '../utils/SyncModule';

class FilePreviewContainer extends BaseFileViewerContainer {
    constructor(props) {
        super(props);
        
        this.navigateBack = this.navigateBack.bind(this);
    }

    async openFile() {
        if(!this.props.isDownloaded) return;

        if(!await OpenFileModule.checkFile(this.name)) return

        OpenFileModule.openFile(this.props.localPath);
    }

    getActionBarActions() {
        return [
            TabBarActionModelFactory.createNewAction(
                () => { this.setFavourite(); }, 
                'Action 1', 
                this.props.isStarred ?
                    require('../images/ActionBar/UnsetFavourite.png') :
                    require('../images/ActionBar/FavoritesIcon.png')
            ),
            TabBarActionModelFactory.createNewAction(() => { this.tryDeleteFile(); }, 'Action 4', require('../images/ActionBar/TrashBucketIcon.png'))
        ];
    }

    render() {
        // this.openFile();

        return(
            <FilePreviewComponent
                openFile = { this.openFile.bind(this) }
                onShare = { this.share.bind(this) }
                isLoading = { this.props.isLoading }
                isDownloaded = { this.props.isDownloaded }
                progress = { this.props.progress }
                onBackPress = { this.navigateBack }
                fileUri = { { uri: "file://" + this.props.localPath } }
                name = { this.name }
                size = { this.props.size }
                mimeType = { this.props.mimeType }
                created = { this.props.created }
                isStarred = { this.props.isStarred }
                showActionBar = { this.state.showActionBar }
                onOptionsPress = { this.toggleActionBar }
                actionBarActions = { this.getActionBarActions() } />
        );   
    }
}

function mapStateToProps(state) {   
    
    let index = state.navReducer.index;
    let fileId = state.navReducer.routes[index].routeName === "FilePreviewScreen" ? state.navReducer.routes[index].params.fileId : null;
    let file = state.filesReducer.fileListModels.find((item) => item.getId() === fileId);
    let isLoading = false;
    let isDownloaded = false;
    let progress = 0;
    let localPath = null;
    let fileRef = 0;
    let size = 0;
    let mimeType = "";
    let created = "";
    let isStarred = false;

    if(file) {
        isLoading = file.isLoading;
        isDownloaded = file.entity.isDownloaded;
        progress = file.progress;
        localPath = file.entity.localPath;
        fileRef = file.fileRef ? file.fileRef: fileRef;
        size = getFileSize(file.entity.size);
        mimeType = file.entity.mimeType;
        created = file.entity.date;
        isStarred = file.getStarred();
    }
        
    return {        
        isLoading,
        isDownloaded,
        progress,
        localPath,
        fileRef,
        size,
        mimeType,
        created,
        isStarred
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ redirectToMainScreen, ...imageViewerActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilePreviewContainer);