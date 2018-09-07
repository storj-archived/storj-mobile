import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import MainNavigationContainer from '../containers/MainNavigationContainer';
import ActionBarComponent from '../components/ActionBarComponent';
import ViewOptionsComponent from '../components/ViewOptionsComponent';
import CreateBucketPopUpComponent from '../components/InputPopUpComponent';
import QRCodeComponent from '../components/MyAccount/QRCodeComponent';
import StorageInfoComponent from '../components/MyAccount/StorageInfoComponent';
import AddCreditComponent from '../components/MyAccount/AddCreditComponent';
import PopUpComponent from '../components/PopUpComponent';
import PinOptionComponent from '../components/PinOptionComponent';
import AnimatedWindowComponent from "../components/AnimatedWindowComponent";
import SyncOverlayComponent from "../components/SynQueue/SyncOverlayComponent";
import SyncQueueListComponent from "../components/SynQueue/SyncQueueListComponent";
import { getHeight } from "../utils/adaptive";
import PropTypes from 'prop-types';
import ServiceModule from "../utils/ServiceModule"

export default class MainComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showOptions: false,
            showQR: false,
            showStorageInfo: false,
            showCredits: false
        };

        this.showOptions = this.showOptions.bind(this);
        this.showQR = this.showQR.bind(this);
        this.showStorageInfo = this.showStorageInfo.bind(this);
        this.showCredits = this.showCredits.bind(this);
        this.onCreateBucketApply = this.onCreateBucketApply.bind(this);
    };

    showOptions() {
        this.setState({ showOptions: !this.state.showOptions });
    }

    showQR() {
        this.setState({ showQR: !this.state.showQR });
    }

    showStorageInfo() {
        this.setState({ showStorageInfo: !this.state.showStorageInfo });
    }

    showCredits() {
        this.setState({ showCredits: !this.state.showCredits });
    }

    onCreateBucketApply(bucketName) {
        this.props.createBucket(bucketName);
        this.props.hideCreateBucketInput(); 
    }
    
    render() {
        const isSelectionMode = this.props.isSelectionMode || this.props.isSingleItemSelected; 

        return(
            <View style={ styles.mainContainer }>
                {
                    this.props.getLoadingSyncEntry() ?
                    <SyncOverlayComponent onPress = { this.props.showSyncWindow }>
                    {
                        this.props.getLoadingSyncEntry()
                    }
                    </SyncOverlayComponent> : null
                }
                <View style = { styles.navigationContainer }>
                    <MainNavigationContainer
                        showSyncWindow = { this.props.showSyncWindow }

                        selectAll = { this.props.selectAll }
                        deselectAll = { this.props.deselectAll }
                        redirectToInitializationScreen = { this.props.redirectToInitializationScreen }
                        showOptions = { this.showOptions }
                        showQR = { this.showQR }
                        showCredits = { this.showCredits }
                        showStorageInfo = { this.showStorageInfo }
                        isSingleItemSelected = { this.props.isSingleItemSelected }
                        isActionBarShown = { this.props.isActionBarShown }
                        isSelectionMode = { this.props.isSelectionMode }
                        onActionBarPress = { this.props.onActionBarPress }
                        buckets = { this.props.buckets }
                        openBucket = { this.props.openBucket } 
                        bucketNavigateBack = { this.props.bucketNavigateBack } 
                        dashboardNavigateBack = { this.props.dashboardNavigateBack } />
                </View>
                {
                    this.props.isActionBarShown || this.props.isSelectionMode ? 
                        <ActionBarComponent
                            applyMargin = { !isSelectionMode }
                            showTriangle = { !isSelectionMode }
                            bucketScreenRouteName = { this.props.bucketScreenRouteName }
                            actions = { this.props.tapBarActions } /> : null
                }
                {
                    this.props.isCreateBucketInputShown ? 
                        <View style = { styles.popUpBackgroundtWrapper }>
                            <View style={ [ styles.popUpBackgroundtWrapper, styles.dimBlack ] } />
                            <CreateBucketPopUpComponent 
                                onCancel = { this.props.hideCreateBucketInput }
                                onApply = { this.onCreateBucketApply } />
                        </View> : null
                }
                {
                    this.props.isLoading ?
                        <View style = { [ styles.backgroundWrapper ] }>
                            <View style = { [ styles.backgroundWrapper, styles.dimBlack ] } />
                            <View style = { [ styles.backgroundWrapper, styles.setChildCenter ] }>
                                <ActivityIndicator animating = { true } color = { "#2782ff" } size = { "large" }/>
                            </View>
                        </View> : null
                }
                {
                    this.state.showOptions ? 
                        <ViewOptionsComponent 
                            getBuckets = { this.props.getBuckets }
                            getFiles = { this.props.getFiles }
                            enableSelectionMode = { this.props.enableSelectionMode }
                            isSelectionMode = { this.props.isSelectionMode }
                            setSorting = { this.props.setSorting }
                            isGridViewShown = { this.props.isGridViewShown }
                            setGridView = { this.props.setGridView }
                            setListView = { this.props.setListView }
                            showOptions = { this.showOptions } /> : null
                }
                {
                    this.state.showQR ? 
                        <QRCodeComponent hideActionBar
                            email = { this.props.email }
                            password = { this.props.password }
                            mnemonic = { this.props.mnemonic }
                            showQR = { this.showQR } /> : null
                }
                {
                    this.state.showStorageInfo ?
                        <StorageInfoComponent 
                            showStorageInfo = { this.showStorageInfo } /> : null
                }
                {
                    this.state.showCredits ?
                        <AddCreditComponent
                            wallets = { this.props.wallets }
                            createWallet = { this.props.createWallet }
                            getWallets = { this.props.getWallets }
                            showCredits = { this.showCredits } /> : null
                }
                {
                    this.props.isChangePasswordPopupShown ? 
                        <PopUpComponent
                            changePasswordPopupStatus = { this.props.changePasswordPopupStatus }
                            message = 'Email sent' /> : null
                }
                {
                    this.props.isPinOptionsShown ? 
                        <PinOptionComponent
                            changePINOptionStatus = { this.props.changePINOptionStatus }
                            redirectToPinCodeGenerationScreen = { this.props.redirectToPinCodeGenerationScreen }
                            deletePIN = { this.props.deletePIN } /> : null
                }
                {
                    this.props.isSyncWindowShown ?
                    <View style = { styles.backgroundWrapper } >
                        <AnimatedWindowComponent style = {[ styles.backgroundWrapper, styles.blackBackround ]} interpolate = { this.props.interpolateBackground } />
                        <AnimatedWindowComponent style = { styles.syncWindowContainer } interpolate = { this.props.interpolate }>
                            <SyncQueueListComponent 
                                title = { this.props.getSyncEntryLoadingCount() + " files uploading" }
                                touchableRightTitle = "Cancel sync"
                                onCancelPress = { this.props.hideSyncWindow }
                                data = { this.props.syncQueueEntries }
                                renderItem = { this.props.renderSyncQueueEntry }  
                                onTouchableRightPress = { ServiceModule.cancelSync }
                            />
                        </AnimatedWindowComponent>
                    </View> : null
                }
            </View>
        );
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    navigationContainer: {
        flex: 1
    },
    backgroundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    blackBackround: {
        backgroundColor: 'black'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.3
    },
    popUpBackgroundtWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    setChildCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    syncWindowContainer: {
        backgroundColor: "white",
        position: "absolute",
        left: 15,
        right: 15,
        borderRadius: 8,
        paddingVertical: getHeight(10),
    }
});


MainComponent.propTypes = {
    bucketNavigateBack: PropTypes.func,
    bucketScreenRouteName: PropTypes.string,
    buckets: PropTypes.array,
    createBucket: PropTypes.func,
    createWallet: PropTypes.func,
    dashboardNavigateBack: PropTypes.func,
    getWallets: PropTypes.func,
    hideCreateBucketInput: PropTypes.func,
    isActionBarShown: PropTypes.bool,
    isCreateBucketInputShown: PropTypes.bool,
    isGridViewShown: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    onActionBarPress: PropTypes.func,
    openBucket: PropTypes.func,
    redirectToInitializationScreen: PropTypes.func,
    setGridView: PropTypes.func,
    setListView: PropTypes.func,
    tapBarActions: PropTypes.array,
    wallets: PropTypes.array,
    email: PropTypes.string,
    password: PropTypes.string,
    mnemonic: PropTypes.string
}; 