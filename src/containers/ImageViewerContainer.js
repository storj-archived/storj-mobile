import {} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { redirectToMainScreen } from '../reducers/navigation/navigationActions';
import { imageViewerActions } from '../reducers/mainContainer/Files/filesReducerActions';
import StorjModule from '../utils/StorjModule';
import TabBarActionModelFactory from '../models/TabBarActionModel';
import ImageViewComponent from "../components/ImageViewerComponent";

class ImageViewerContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showActionBar: false
        };

        this.localPath = "file://" + props.navigation.state.params.localPath;
        this.fileId = props.navigation.state.params.fileId;
        this.bucketId = props.navigation.state.params.bucketId;

        this.toggleActionBar = this.toggleActionBar.bind(this);

        this.actionBarActions = actionBarActions = [
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 1', require('../images/ActionBar/FavoritesIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 2', require('../images/ActionBar/move.png')),
            TabBarActionModelFactory.createNewAction(() => { console.log('Action 3') }, 'Action 3', require('../images/ActionBar/CopyBucketIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { this.deleteImage(); }, 'Action 4', require('../images/ActionBar/TrashBucketIcon.png'))
        ];
    }

    toggleActionBar() {
        this.setState({
            showActionBar: !this.state.showActionBar
        });
    }

    async deleteImage() {
        let deleteFileResponse = await StorjModule.deleteFile(this.bucketId, this.fileId);

        if(deleteFileResponse.isSuccess) {
            this.props.deleteFile(this.bucketId, this.fileId);
            this.props.redirectToMainScreen();
        }
    }

    static navigationOptions = { header: null };

    render() {
        return(
            <ImageViewComponent
                onBackPress = { this.props.redirectToMainScreen }
                imageUri = { { uri: this.localPath } }
                showActionBar = { this.state.showActionBar }
                onOptionsPress = { this.toggleActionBar }
                actionBarActions = { this.actionBarActions } />
        );   
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ redirectToMainScreen, ...imageViewerActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageViewerContainer);