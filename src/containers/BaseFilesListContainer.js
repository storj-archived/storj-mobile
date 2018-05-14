import React, { Component } from 'react';
import BaseListContainer from "../containers/BaseListContainer";
import ServiceModule from '../utils/ServiceModule';
import StorjModule from '../utils/StorjModule';
import PropTypes from 'prop-types';
import ListItemModel from '../models/ListItemModel';
import FileModel from '../models/FileModel';
import { isImage } from '../utils/fileUtils';

/** 
 * Base class for all screen with file lists
*/
class BaseFilesListContainer extends BaseListContainer {
    constructor(props) {
        super(props);
    }    
            
    /**
     * Combine all files and uploading files
     * @returns {ListItemModel<FileModel>[]} ListItemModels initialized with FileModel
     */
    getData() { 
        return this.props.fileListModels.concat(this.props.uploadingFileListModels)
                                        .filter(file => file.entity.bucketId === this.props.bucketId);
    }

    /**
     * Implementation of virtual method from baseListContainer
     * that handles file on onPress
     * Opens image viewer if file downloaded and its mime type is image
     * @param {ListItemModel<FileModel>} file ListItemModel initialized with FileModel
     */
    _onPress(file) {
        // if(/* file.entity.isDownloaded && */ file.entity.mimeType.includes('image/')) {
        if(isImage(file.entity.name)){
            this.props.openImageViewer(file.getId(), file.entity.bucketId, file.getName());
        }
    }

    /**
     * Implementation of virtual method from baseListContainer
     * that handles change of file's selection status
     * @param {ListItemModel<FileModel>} file ListItemModel initialized with FileModel 
     */
    _onSelectionPress(file) {
        if(file.isSelected)
            this.props.deselectFile(file);
        else
            this.props.selectFile(file);
    }

    /**
     * Uploads data from Storj Network, set loader indicators
     */
    onRefresh() {
        this.props.pushLoading(this.props.bucketId);
        ServiceModule.getFiles(this.props.bucketId);         
    }

    /**
     * Cancels file download
     * @param {ListItemModel<FileModel>} file ListItemModel initialized with FileModel
     */
    async cancelDownload(file) {
        let cancelDownloadResponse = await StorjModule.cancelDownload(file.fileRef);

        if(cancelDownloadResponse.isSuccess) {
            this.props.fileDownloadCanceled(file.entity.bucketId, file.getId());
        }
    }

    /**
     * Cancels file upload
     * @param {ListItemModel<FileModel>} file ListItemModel initialized with FileModel
     */
    async cancelUpload(file) {        
        let cancelUploadResponse = await StorjModule.cancelUpload(file.fileRef);

        if(cancelUploadResponse.isSuccess) {
            this.props.fileUploadCanceled(file.entity.bucketId, file.getId());
        }
    }

    /**
     * Implementation of BaseListContainer's onCancel callback
     * Choose what cancel method should be triggered  
     * @param {ListItemModel<FileModel>} file ListItemModel initialized with FileModel
     */
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