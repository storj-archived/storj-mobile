import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import { getShortBucketName } from "../utils/fileUtils";
import MainNavigationContainer from '../containers/MainNavigationContainer';
import ActionBarComponent from '../components/ActionBarComponent';
import ViewOptionsComponent from '../components/ViewOptionsComponent';
import CreateBucketPopUpComponent from '../components/InputPopUpComponent';
import QRCodeComponent from '../components/MyAccount/QRCodeComponent';
import StorageInfoComponent from '../components/MyAccount/StorageInfoComponent';
import AddCreditComponent from '../components/MyAccount/AddCreditComponent';
import PopUpComponent from '../components/PopUpComponent';
import SelectBucketComponent from '../components/SelectBucketComponent';
import PinOptionComponent from '../components/PinOptionComponent';
import PropTypes from 'prop-types';

export default class MainComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showOptions: false,
            showQR: false,
            showStorageInfo: false,
            showCredits: false,
            showPopUp: false,
            isSelectBucketShown: false
        }
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

    showPopUp() {
        this.setState({ showPopUp: !this.state.showPopUp });
    }

    showSelectBuckets(callback) {
        if(callback) {
            this.selectBucketCallback = callback;
        }
        
        this.setState({ isSelectBucketShown: !this.state.isSelectBucketShown })
    }
    
    render() {
        const isSelectionMode = this.props.isSelectionMode || this.props.isSingleItemSelected; 

        return(
            <View style={ styles.mainContainer }>
                <View style = { styles.navigationContainer }>
                    <MainNavigationContainer
                        selectAll = { this.props.selectAll }
                        deselectAll = { this.props.deselectAll }
                        redirectToInitializationScreen = { this.props.redirectToInitializationScreen }
                        showOptions = { this.showOptions.bind(this) }
                        showQR = { this.showQR.bind(this) }
                        showCredits = { this.showCredits.bind(this) }
                        showStorageInfo = { this.showStorageInfo.bind(this) }
                        showPopUp = { this.showPopUp.bind(this) }
                        isSingleItemSelected = { this.props.isSingleItemSelected }
                        isActionBarShown = { this.props.isActionBarShown }
                        isSelectionMode = { this.props.isSelectionMode }
                        onActionBarPress = { () => { this.props.onActionBarPress(); } }
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
                                onCancel = { () => { this.props.hideCreateBucketInput(); } }
                                onApply = { (bucketName) => { 
                                    this.props.createBucket(bucketName);
                                    this.props.hideCreateBucketInput(); 
                                }} />
                        </View> : null
                }
                {
                    this.state.isSelectBucketShown  
                        ? <SelectBucketComponent
                            getItemSize = { () => {} }
                            isLoading = { false }
                            searchSubSequence = { null }
                            sortingMode = { null }
                            onRefresh = { () => {} }
                            isGridViewShown = { this.props.isGridViewShown }
                            onPress = { (bucket) => { this.selectBucketCallback({ bucketId: bucket.getId() }); } }
                            onLongPress = { () => {} }
                            onDotsPress = { () => {} }
                            onCancelPress = { () => {} }
                            selectedItemId = { null }
                            isSelectionMode = { false }
                            data = { this.props.buckets }
                            getBucketName = { getShortBucketName }
                            
                            showOptions = { this.showOptions.bind(this) }
                            navigateBack = { this.showSelectBuckets.bind(this) } />
                        : null
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
                            showOptions = { this.showOptions.bind(this) } /> : null
                }
                {
                    this.state.showQR ? 
                        <QRCodeComponent hideActionBar
                            email = { this.props.email }
                            password = { this.props.password }
                            mnemonic = { this.props.mnemonic }
                            showQR = { this.showQR.bind(this) } /> : null
                }
                {
                    this.state.showStorageInfo ?
                        <StorageInfoComponent 
                            showStorageInfo = { this.showStorageInfo.bind(this) } /> : null
                }
                {
                    this.state.showCredits ?
                        <AddCreditComponent
                            wallets = { this.props.wallets }
                            createWallet = { this.props.createWallet }
                            getWallets = { this.props.getWallets }
                            showCredits = { this.showCredits.bind(this) } /> : null
                }
                {
                    this.state.showPopUp ? 
                        <PopUpComponent
                            showPopUp = { this.showPopUp.bind(this) }
                            message = 'Email sent' /> : null
                }
                {
                    this.props.isPinOptionsShown ? 
                        <PinOptionComponent
                            changePINOptionStatus = { this.props.changePINOptionStatus }
                            redirectToPinCodeGenerationScreen = { this.props.redirectToPinCodeGenerationScreen }
                            deletePIN = { this.props.deletePIN } /> : null
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