import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import SettingsComponent from "../components/MyAccount/SettingsComponent";
import { SYNC_BUCKETS } from "../utils/constants/SyncBuckets";
import { 
    listSettingsAsync,
    changeSyncStatusAsync,
    setWifiConstraintAsync,
    setChargingConstraintAsync,
    syncMusicAsync, 
    syncPhotosAsync, 
    syncDocumentsAsync, 
    syncMoviesAsync 
} from "../reducers/mainContainer/MyAccount/Settings/SettingsActionsAsync";
import {
    changePINOptionStatus
} from '../reducers/mainContainer/mainReducerActions';
import ServiceModule from '../utils/ServiceModule';

class SettingsContainer extends Component {
    constructor(props) {
        super(props);

        //Move to initialization screen or something similar
        props.listSettings(props.email);
        this.email = props.email;

        this.changeSyncStatus = this.changeSyncStatus.bind(this);
        this.setWifiConstraint = this.setWifiConstraint.bind(this);
        this.setChargingConstraint = this.setChargingConstraint.bind(this);
        this.syncPhotosAction = this.syncPhotosAction.bind(this);
        this.syncMoviesAction = this.syncMoviesAction.bind(this);
        this.syncDocumentsAction = this.syncDocumentsAction.bind(this);
        this.syncMusicAction = this.syncMusicAction.bind(this);
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
            syncMusic: this.props.syncMusic
        };
    }

    changeSyncStatus(value) {
        value ? this.checkSyncBucketsExistance() : null;
        this.props.changeSyncStatus(this.email, value);
    }
    setWifiConstraint(value, prevSettingsState) {
        this.props.setWifiConstraint(this.email, value, prevSettingsState);
    }
    setChargingConstraint(value, prevSettingsState) {
        this.props.setChargingConstraint(this.email, value, prevSettingsState);
    }
    syncPhotosAction(value, prevSettingsState) {
        this.props.syncPhotosAction(this.email, value, prevSettingsState);
    }
    syncMoviesAction(value, prevSettingsState) {
        this.props.syncMoviesAction(this.email, value, prevSettingsState);
    }
    syncDocumentsAction(value, prevSettingsState) {
        this.props.syncDocumentsAction(this.email, value, prevSettingsState);
    }
    syncMusicAction(value, prevSettingsState) {
        this.props.syncMusicAction(this.email, value, prevSettingsState);
    }

    checkSyncBucketsExistance() {
        let syncSettings = this.getStateObject();

        syncSettings.syncPhotos ? this.createBucketIfNotExists(SYNC_BUCKETS.PICTURES) : null;
        syncSettings.syncMovies ? this.createBucketIfNotExists(SYNC_BUCKETS.MOVIES) : null;
        syncSettings.syncDocuments ? this.createBucketIfNotExists(SYNC_BUCKETS.DOCUMENTS) : null;
        syncSettings.syncMusic ? this.createBucketIfNotExists(SYNC_BUCKETS.MUSIC) : null;
    }
    createBucketIfNotExists(bucketName) {
        let bucket = this.props.buckets.find(bucketItem => bucketItem.getName() === bucketName);

        if(!bucket) {
            ServiceModule.createBucket(bucketName);
        }
    }

    render() {
        return(
            <SettingsComponent
                screenProps = { this.props.screenProps }
                email = { this.props.email }
                navigation = { this.props.navigation }
                changeSyncStatus = { this.changeSyncStatus }
                setWifiConstraint = { this.setWifiConstraint }
                setChargingConstraint = { this.setChargingConstraint }
                syncPhotosAction = { this.syncPhotosAction }
                syncMoviesAction = { this.syncMoviesAction }
                syncDocumentsAction = { this.syncDocumentsAction }
                syncMusicAction = { this.syncMusicAction }
                getStateObject = { this.getStateObject }
                syncStatus = { this.props.syncStatus }
                onWifi = { this.props.onWifi } 
                onCharging = { this.props.onCharging }
                syncPhotos = { this.props.syncPhotos }
                syncMovies = { this.props.syncMovies }
                syncDocuments = { this.props.syncDocuments } 
                syncMusic = { this.props.syncMusic }
                changePINOptionStatus = { this.props.changePINOptionStatus } />
        );
    }
} 

function mapStateToProps(state) {
    return {
        ...state.settingsReducer,
        email: state.mainReducer.email,
        buckets: state.bucketReducer.buckets
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({ 
            changePINOptionStatus }, dispatch), 
        listSettings: (settingsId) => dispatch(listSettingsAsync(settingsId)),
        changeSyncStatus: (settingsId, value) => dispatch(changeSyncStatusAsync(settingsId, value)),
        setWifiConstraint: (settingsId, value, prevSettingsState) => dispatch(setWifiConstraintAsync(settingsId, value, prevSettingsState)),
        setChargingConstraint: (settingsId, value, prevSettingsState) => dispatch(setChargingConstraintAsync(settingsId, value, prevSettingsState)),
        syncPhotosAction: (settingsId, value, prevSettingsState) => dispatch(syncPhotosAsync(settingsId, value, prevSettingsState)),
        syncMoviesAction: (settingsId, value, prevSettingsState) => dispatch(syncMoviesAsync(settingsId, value, prevSettingsState)),
        syncDocumentsAction: (settingsId, value, prevSettingsState) => dispatch(syncDocumentsAsync(settingsId, value, prevSettingsState)),
        syncMusicAction: (settingsId, value, prevSettingsState) => dispatch(syncMusicAsync(settingsId, value, prevSettingsState))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);