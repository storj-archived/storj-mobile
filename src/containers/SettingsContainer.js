import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import SettingsComponent from "../components/MyAccount/SettingsComponent";
import { 
    listSettingsAsync, 
    syncDownloadsAsync, 
    syncPhotosAsync, 
    syncDocumentsAsync, 
    syncMoviesAsync 
} from "../reducers/mainContainer/MyAccount/Settings/SettingsActionsAsync";

const settingsId = "elvy.baila@arockee.com";

class SettingsContainer extends Component {
    constructor(props) {
        super(props);

        //Move to initialization screen or something similar
        props.listSettings(settingsId);

        this.getStateObject = this.getStateObject.bind(this);
    }

    getStateObject() {
        return {
            syncStatus: this.props.syncStatus,
            onWifi: this.props.onWifi,
            onCharging: this.props.onCharging,
            syncPhotos: this.props.syncPhotos,
            syncMovies: this.props.syncMovies,
            syncDocuments: this.props.syncDocuments,
            syncDownloads: this.props.syncDownloads
        };
    }

    render() {
        return(
            <SettingsComponent
                navigation = { this.props.navigation }
                listSettings = { this.props.listSettings }
                syncPhotosAction = { this.props.syncPhotosAction }
                syncMoviesAction = { this.props.syncMoviesAction }
                syncDocumentsAction = { this.props.syncDocumentsAction }
                syncDownloadsAction = { this.props.syncDownloadsAction }
                getStateObject = { this.getStateObject }
                syncStatus = { this.props.syncStatus }
                onWifi = { this.props.onWifi } 
                onCharging = { this.props.onCharging }
                syncPhotos = { this.props.syncPhotos }
                syncMovies = { this.props.syncMovies }
                syncDocuments = { this.props.syncDocuments } 
                syncDownloads = { this.props.syncDownloads } />
        );
    }
} 

function mapStateToProps(state) {
    return {
        ...state.settingsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        listSettings: () => dispatch(listSettingsAsync(settingsId)),
        syncPhotosAction: (value, prevSettingsState) => dispatch(syncPhotosAsync(settingsId, value, prevSettingsState)),
        syncMoviesAction: (value, prevSettingsState) => dispatch(syncMoviesAsync(settingsId, value, prevSettingsState)),
        syncDocumentsAction: (value, prevSettingsState) => dispatch(syncDocumentsAsync(settingsId, value, prevSettingsState)),
        syncDownloadsAction: (value, prevSettingsState) => dispatch(syncDownloadsAsync(settingsId, value, prevSettingsState))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);