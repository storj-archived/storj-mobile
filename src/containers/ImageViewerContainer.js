import { Alert } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { redirectToMainScreen } from '../reducers/navigation/navigationActions';
import { imageViewerActions } from '../reducers/mainContainer/Files/filesReducerActions';
import ServiceModule from '../utils/ServiceModule';
import StorjModule from "../utils/StorjModule";
import SyncModule from "../utils/SyncModule";
import TabBarActionModelFactory from '../models/TabBarActionModel';
import ImageViewComponent from "../components/ImageViewerComponent";
import ListItemModel from '../models/ListItemModel';
import FileModel from "../models/FileModel";

class ImageViewerContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showActionBar: false
        };

        this.fileId = props.navigation.state.params.fileId;
        this.bucketId = props.navigation.state.params.bucketId;
        this.name = props.navigation.state.params.fileName;

        this.toggleActionBar = this.toggleActionBar.bind(this);
    }

    async componentWillMount() {
        if(!this.props.isDownloaded) {
            let result = await StorjModule.getDownloadFolderPath();
            console.log(this.bucketId, this.fileId, result + "/" + this.name);
            ServiceModule.downloadFile(this.bucketId, this.fileId, result + "/" + this.name);

            return;
        }
        
        let checkImageResponse = await SyncModule.checkImage(this.fileId, this.props.localPath);
        
        if(!checkImageResponse.isSuccess) {
            this.props.downloadFileError(this.bucketId, this.fileId);
            this.props.redirectToMainScreen();
        }
    }

    toggleActionBar() {
        this.setState({
            showActionBar: !this.state.showActionBar
        });
    }

    async setFavourite() {
        let updateStarredResponse = await SyncModule.updateFileStarred(this.fileId, !this.isStarred);
        
        if(updateStarredResponse.isSuccess) {
            this.props.updateFavouriteFiles([new ListItemModel(new FileModel({ fileId: this.fileId }))]);
        }    
    }

    tryDeleteFile() {
        Alert.alert(
            'Delete permanently?',
            'Are you sure to delete selected files permanently?',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                { text: 'Delete', onPress: () => this.deleteImage() }
            ],
            { cancelable: false }
        );
    }

    async deleteImage() {
        let deleteResponse = await ServiceModule.deleteFile(this.bucketId, this.fileId);
        this.props.redirectToMainScreen();
    }

    tryCopySelectedFile() {
        this._imageViewComponent.showSelectBuckets(this.copySelectedFile.bind(this));
    }

    copySelectedFile(params) {
        let bucketId = params.bucketId;

        if(bucketId) {
            ServiceModule.uploadFile(bucketId, this.props.localPath);
        }

        this._imageViewComponent.showSelectBuckets();
    }

    async navigateBack() {
        if(this.props.isLoading) {
            await this.cancelDownload();
        }

        this.props.redirectToMainScreen();
    }

    async cancelDownload() {
        let cancelDownloadResponse = await StorjModule.cancelDownload(this.props.fileRef);

        if(cancelDownloadResponse.isSuccess) {
            this.props.fileDownloadCanceled(this.bucketId, this.fileId);
        }
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
            TabBarActionModelFactory.createNewAction(() => { this.tryCopySelectedFile()}, 'Action 3', require('../images/ActionBar/CopyBucketIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { this.tryDeleteFile(); }, 'Action 4', require('../images/ActionBar/TrashBucketIcon.png'))
        ];
    }

    static navigationOptions = { header: null };

    render() {
        return(
            <ImageViewComponent
                isLoading = { this.props.isLoading }
                isDownloaded = { this.props.isDownloaded }
                progress = { this.props.progress }
                ref = { component => this._imageViewComponent = component }
                onBackPress = { this.navigateBack.bind(this) }
                imageUri = { { uri: "file://" + this.props.localPath } }
                showActionBar = { this.state.showActionBar }
                onOptionsPress = { this.toggleActionBar }
                isGridViewShown = { this.props.isGridViewShown }
                buckets = { this.props.buckets }
                actionBarActions = { this.getActionBarActions() } />
        );   
    }
}

function mapStateToProps(state) {
    let index = state.navReducer.index;
    let fileId = state.navReducer.routes[index].routeName === "ImageViewerScreen" ? state.navReducer.routes[index].params.fileId : null;
    let file = state.filesReducer.fileListModels.find((item) => item.getId() === fileId);
    let isStarred = false;
    let isLoading = false;
    let isDownloaded = false;
    let progress = 0;
    let localPath = null;
    let fileRef = 0;

    if(file) {
        isStarred = file.getStarred();
        isLoading = file.isLoading;
        isDownloaded = file.entity.isDownloaded;
        progress = file.progress;
        localPath = file.entity.localPath;
        fileRef = file.fileRef ? file.fileRef: fileRef;
    }
        
    return {
        isStarred,
        isLoading,
        isDownloaded,
        progress,
        localPath,
        fileRef,
        isGridViewShown: state.mainReducer.isGridViewShown,
        buckets: state.bucketReducer.buckets
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ redirectToMainScreen, ...imageViewerActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageViewerContainer);