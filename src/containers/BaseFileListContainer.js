import React, { Component } from 'react';
import ServiceModule from '../utils/ServiceModule';
import StorjModule from '../utils/StorjModule';
import PropTypes from 'prop-types';

class BaseFileListContainer extends Component {
    constructor(props) {
        super(props);
    }    
            
    getData() { 
        return this.props.fileListModels.concat(this.props.uploadingFileListModels)
                                        .filter(file => file.entity.bucketId === this.props.bucketId);
    }

    onPress(file) {        
        if(file.entity.isDownloaded && file.entity.mimeType.includes('image/')) {
            this.props.openImageViewer(file.getId(), file.entity.localPath, file.entity.bucketId, file.getStarred());
        }
    }

    onRefresh() {
        this.props.pushLoading(this.props.bucketId);
        ServiceModule.getFiles(this.props.bucketId); 
        this.props.listUploadingFilesAsync(this.props.bucketId); 
    }

    async cancelDownload(file) {
        let cancelDownloadResponse = await StorjModule.cancelDownload(file.fileRef);

        if(cancelDownloadResponse.isSuccess) {
            this.props.fileDownloadCanceled(this.props.bucketId, file.getId());
        }
    }

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