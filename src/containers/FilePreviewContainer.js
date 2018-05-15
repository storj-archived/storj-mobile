import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TabBarActionModelFactory from '../models/TabBarActionModel';
import FilePreviewComponent from "../components/FilePreviewComponent";

class FilePreviewContainer extends Component {
    constructor(props) {
        super(props);
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
            TabBarActionModelFactory.createNewAction(() => { () => {} }, 'Action 3', require('../images/ActionBar/CopyBucketIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { () => {} }, 'Action 4', require('../images/ActionBar/TrashBucketIcon.png'))
        ];
    }


    static navigationOptions = { header: null };

    render() {
        return(
            <FilePreviewComponent
                onShare = { () => {} }
                isLoading = { false }
                isDownloaded = { true }
                progress = { 0 }
                ref = { component => this._filePreviewComponent = component }
                onBackPress = { () => {} }
                imageUri = { null }
                showActionBar = { false }
                onOptionsPress = { () => {} }
                isGridViewShown = { false }
                buckets = { [] }
                actionBarActions = { this.getActionBarActions() } />
        );   
    }
}

function mapStateToProps(state) {   
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilePreviewContainer);