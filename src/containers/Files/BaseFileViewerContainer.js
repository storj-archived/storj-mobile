import { Component } from 'react';
import { Alert, BackHandler, Platform } from 'react-native';
import ServiceModule from '../../utils/ServiceModule';
import StorjModule from '../../utils/StorjModule';
import SyncModule from '../../utils/SyncModule';
import OpenFileModule from '../../utils/OpenFileModule';
import ListItemModel from '../../models/ListItemModel';
import FileModel from "../../models/FileModel";

/** 
 * Base class for all screen containers file preview + upload functionality
*/
class BaseFileViewerContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showActionBar: false
        };

        this.fileId = props.navigation.state.params.fileId;
        this.bucketId = props.navigation.state.params.bucketId;
        this.name = props.navigation.state.params.fileName;
        this.showProgress = true;

        this.toggleActionBar = this.toggleActionBar.bind(this);
        this.navigateBack = this.navigateBack.bind(this);
        this.share = this.share.bind(this);
    }

    /**
     *Remove standart navigation header 
     */
    static navigationOptions = {
        header: null
    };

    toggleActionBar() {
        this.setState({
            showActionBar: !this.state.showActionBar
        });
    }

    async componentWillMount() {
        if(Platform.OS === 'android') {
			BackHandler.addEventListener("hardwareBackPress", this.navigateBack);
		}
        
        if(!this.props.isDownloaded) {
            let result = await StorjModule.getDownloadFolderPath();

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

    async setFavourite() {
        let updateStarredResponse = await SyncModule.updateFileStarred(this.fileId, !this.props.isStarred);
        
        if(updateStarredResponse.isSuccess) {
            this.props.updateFavouriteFiles([new ListItemModel(new FileModel({ fileId: this.fileId }))], !this.props.isStarred);
        }    
    }

    tryDeleteFile() {
        Alert.alert(
            'Delete permanently?',
            'Are you sure to delete selected files permanently?',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                { text: 'Delete', onPress: () => this.deleteFile() }
            ],
            { cancelable: false }
        );
    }

    async deleteFile() {
        await ServiceModule.deleteFile(this.bucketId, this.fileId);
        this.props.redirectToMainScreen();
    }

    async share(url) {
        if(!this.props.isDownloaded) {
            return;
        }

        await OpenFileModule.shareFile(url);
    }

    render() {
        return null;
    }
}

export default BaseFileViewerContainer;