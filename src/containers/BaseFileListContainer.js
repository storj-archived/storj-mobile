import React, { Component } from 'react';
import ServiceModule from '../utils/ServiceModule';
import StorjModule from '../utils/StorjModule';
import PropTypes from 'prop-types';

/** 
 * Base class for all screen with file lists
*/
class BaseFileListContainer extends Component {
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
    onPress(file) {        
        if(file.entity.isDownloaded && file.entity.mimeType.includes('image/')) {
            this.props.openImageViewer(file.getId(), file.entity.localPath, file.entity.bucketId, file.getStarred());
        }
    }

    /**
     * Uploads data from Storj Network, set loader indicators
     */
    onRefresh() {
        this.props.pushLoading(this.props.bucketId);
        ServiceModule.getFiles(this.props.bucketId); 
        this.props.listUploadingFilesAsync(this.props.bucketId); 
    }

    /**
     * cancels file download
     */
    async cancelDownload(file) {
        let cancelDownloadResponse = await StorjModule.cancelDownload(file.fileRef);

        if(cancelDownloadResponse.isSuccess) {
            this.props.fileDownloadCanceled(this.props.bucketId, file.getId());
        }
    }

    /**
     * cancels file upload
     */
    async cancelUpload(file) {        
        let cancelUploadResponse = await StorjModule.cancelUpload(file.fileRef);

        if(cancelUploadResponse.isSuccess) {
            this.props.fileUploadCanceled(this.props.bucketId, file.getId());
        }
    }

    render() {
        return null;
    }
}

export default BaseFileListContainer;

BaseFileListContainer.propTypes = {
    
    bucketId: PropTypes.string,    
    fileListModels: PropTypes.array,
    uploadingFileListModels: PropTypes.array,
    pushLoading: PropTypes.func,
    listUploadingFilesAsync: PropTypes.func,
    fileDownloadCanceled: PropTypes.func,
    fileUploadCanceled: PropTypes.func
};