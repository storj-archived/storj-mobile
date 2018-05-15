import React, { Component } from 'react';
import { BackHandler, Platform } from 'react-native';
import ServiceModule from '../utils/ServiceModule';
import StorjModule from '../utils/StorjModule';
import SyncModule from '../utils/SyncModule';
import ListItemModel from '../models/ListItemModel';
import PropTypes from 'prop-types';

/** 
 * Base class for all screen containers file preview + upload functionality
*/
class BaseFileViewerContainer extends Component {
    constructor(props) {
        super(props);

        this.fileId = props.navigation.state.params.fileId;
        this.bucketId = props.navigation.state.params.bucketId;
        this.name = props.navigation.state.params.fileName;
    }

    /**
     *Remove standart navigation header 
     */
    static navigationOptions = {
        header: null
    };

    async componentWillMount() {
        console.log(this.bucketId, this.fileId, this.name);
        console.log(this.props);
        if(Platform.OS === 'android') {
			BackHandler.addEventListener("hardwareBackPress", this.navigateBack);
		}
        
        if(!this.props.isDownloaded) {
            let result = await StorjModule.getDownloadFolderPath();
            console.log(result);
            ServiceModule.downloadFile(this.bucketId, this.fileId, result + "/" + this.name);

            return;
        }
        
        let checkImageResponse = await SyncModule.checkFile(this.fileId, this.props.localPath);
        
        if(!checkImageResponse.isSuccess) {
            this.props.downloadFileError(this.bucketId, this.fileId);
            this.props.redirectToMainScreen();
        }
    }

    componentWillUnmount() {
		if(Platform.OS === 'android') {
			BackHandler.removeEventListener("hardwareBackPress", this.navigateBack);
        }
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

    render() {
        return null;
    }
}

export default BaseFileViewerContainer;