import React, { Component } from 'react';
import BaseListContainer from "../containers/BaseListContainer";
import ServiceModule from '../utils/ServiceModule';
import StorjModule from '../utils/StorjModule';
import PropTypes from 'prop-types';

/** 
 * Base class for all screen with file lists
*/
class BaseFilesListContainer extends BaseListContainer {
    constructor(props) {
        super(props);
    }    
            
    /**
     * Combine all files and uploading files
     */
    getData() { 
        return this.props.fileListModels.concat(this.props.uploadingFileListModels)
                                        .filter(file => file.entity.bucketId === this.props.bucketId);
    }

    /**
     * Opens image viewer if file downloaded and its mime type is image
     */
    _onPress(file) {        
        if(file.entity.isDownloaded && file.entity.mimeType.includes('image/')) {
            this.props.openImageViewer(file.getId(), file.entity.localPath, file.entity.bucketId, file.getStarred());
        }
    }

    _onSelectionPress(item) {
        if(item.isSelected)
            this.props.deselectFile(item);
        else
            this.props.selectFile(item);
    }

    /**
     * Uploads data from Storj Network, set loader indicators
     */
    onRefresh() {
        this.props.pushLoading(this.props.bucketId);
        ServiceModule.getFiles(this.props.bucketId);         
    }

    /**
     * cancels file download
     */
    async cancelDownload(file) {
        let cancelDownloadResponse = await StorjModule.cancelDownload(file.fileRef);

        if(cancelDownloadResponse.isSuccess) {
            this.props.fileDownloadCanceled(file.entity.bucketId, file.getId());
        }
    }

    /**
     * cancels file upload
     */
    async cancelUpload(file) {        
        let cancelUploadResponse = await StorjModule.cancelUpload(file.fileRef);

        if(cancelUploadResponse.isSuccess) {
            this.props.fileUploadCanceled(file.entity.bucketId, file.getId());
        }
    }

    onCancelPress(file) {
        file.entity.hmac ? this.cancelDownload(file) : this.cancelUpload(file);
    }

    render() {
        return null;
    }
}

export default BaseFilesListContainer;

BaseFilesListContainer.propTypes = {
    bucketId: PropTypes.string,    
    fileListModels: PropTypes.array,
    uploadingFileListModels: PropTypes.array,
    pushLoading: PropTypes.func,
    fileDownloadCanceled: PropTypes.func,
    fileUploadCanceled: PropTypes.func
};