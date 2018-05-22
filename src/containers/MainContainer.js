import { Keyboard, BackHandler, Platform, Alert } from 'react-native';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
    showActionBar,
    hideActionBar,
    showCreateBucketInput,
    hideCreateBucketInput,
    setGridView,
    setListView,
    openBucket,
    setSorting,
    enableSelectionMode,
    disableSelectionMode,
    changePINOptionStatus,
    changePasswordPopupStatus
} from '../reducers/mainContainer/mainReducerActions';
import {    
    createBucket,
    deleteBucket, 
    updateFavourite,
    selectBuckets,
    deselectBuckets,
    getBuckets
} from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { 
    deleteFile, 
    updateFavouriteFiles,
    selectFiles,
    listFiles,
    deselectFiles
} from '../reducers/mainContainer/Files/filesReducerActions';
import { 
    redirectToMainScreen, 
    redirectToInitializationScreen, 
    bucketNavigateBack, 
    dashboardNavigateBack,
    redirectToPinCodeGenerationScreen
} from '../reducers/navigation/navigationActions';
import { createWallet, getWallets } from '../reducers/billing/billingActions';
import TabBarActionModelFactory from '../models/TabBarActionModel';
import MainComponent from '../components/MainComponent';
import filePicker from '../utils/filePicker';
import observablePropFactory from '../models/ObservableProperty';
import ServiceModule from '../utils/ServiceModule';
import SyncModule from '../utils/SyncModule';
import StorjModule from '../utils/StorjModule';
import CameraModule from '../utils/CameraModule';
import { SYNC_BUCKETS } from '../utils/constants/SyncBuckets';
import ListItemModel from '../models/ListItemModel';
import BucketModel from '../models/BucketModel';
import FileModel from '../models/FileModel';

const { PICTURES } = SYNC_BUCKETS;

class MainContainer extends Component {
    constructor(props) {
        super(props);

        //Common stuff
        let newAction = TabBarActionModelFactory.createNewAction;
        let uploadFileIcon = require('../images/ActionBar/UploadFileIcon.png');
        let favIcon = require('../images/ActionBar/FavoritesIcon.png');
        let unfavIcon = require('../images/ActionBar/UnsetFavourite.png');
        let trashIcon = require('../images/ActionBar/TrashBucketIcon.png');
        let iosUploadPhotoIcon = require('../images/ActionBar/IosUploadPhoto.png');
        let iosUploadFileIcon = require('../images/ActionBar/IosUploadFile.png');

        //Action callbacks
        let createBucketAction = newAction(() => { this.props.showCreateBucketInput(); }, require('../images/ActionBar/NewBucketIcon.png'));
        let openFilePickerAction = (type, imgUrl) => newAction(() => { this.bucketScreenUploadFile(type) }, imgUrl);
        let openCameraAction = (id) => newAction(() => { CameraModule.openCamera(id); }, require('../images/ActionBar/UploadPhotoIcon.png'));
        let uploadFileAction = (bucketId, type, imgUrl) => newAction(() => { this.uploadFile(bucketId, type); }, imgUrl);
        let setFavouriteAction = newAction(() => { this.setFavourite(); }, props.isStarredBucketsSelected ? unfavIcon
                                                                                                          : favIcon);
        let uploadFileToSelectedBucketsAction = (type, imgUrl) => newAction(() => { this.uploadFileToSelectedBuckets(type); }, imgUrl);
        let tryDeleteBucketsAction = newAction(() => { this.tryDeleteBuckets(); }, trashIcon);
        let setFavouriteFilesAction = newAction(() => { this.setFavouriteFiles(); }, this.props.isStarredFilesSelected ? unfavIcon 
                                                                                                                       : favIcon);
        let downloadSelectedFilesAction = newAction(() => { this.downloadSelectedFiles(); }, require('../images/ActionBar/DownloadIFileIcon.png'));
        let tryCopySelectedFilesAction = newAction(() => { this.tryCopySelectedFiles(); }, require('../images/ActionBar/CopyBucketIcon.png'));
        let tryDeleteFiles = newAction(() => { this.tryDeleteFiles(); }, trashIcon);

        //Action arrays
        this.bucketActions = Platform.OS === "android" 
            ? [ createBucketAction, openFilePickerAction(null, uploadFileIcon), openCameraAction(this.props.myPhotosBucketId) ] 
            : [ createBucketAction, openFilePickerAction("document", iosUploadFileIcon), 
                openFilePickerAction("image", iosUploadPhotoIcon), openCameraAction(this.props.myPhotosBucketId) ];
    
        this.selectionBucketActions = Platform.OS === "android" 
            ? [ setFavouriteAction, uploadFileToSelectedBucketsAction(null, uploadFileIcon), tryDeleteBucketsAction ]
            : [ setFavouriteAction, uploadFileToSelectedBucketsAction("document", iosUploadFileIcon), 
                uploadFileToSelectedBucketsAction("image", iosUploadPhotoIcon), tryDeleteBucketsAction ];

        this.selectionFileActions = [
            setFavouriteFilesAction,
            downloadSelectedFilesAction, 
            tryCopySelectedFilesAction, 
            tryDeleteFiles
        ];

        this.openedBucketActions = Platform.OS === "android" 
            ? [ uploadFileAction(props.myPhotosBucketId, "", uploadFileIcon), openCameraAction(props.openedBucketId) ]
            : [ uploadFileAction(props.myPhotosBucketId, "document", iosUploadFileIcon), 
                uploadFileAction(props.myPhotosBucketId, "image", iosUploadPhotoIcon), openCameraAction(props.openedBucketId) ]

        this.dashboardBucketActions = Platform.OS === "android" 
            ? [ uploadFileAction(this.props.dashboardBucketId, "", uploadFileIcon), openCameraAction(props.dashboardBucketId) ]
            : [ uploadFileAction(this.props.dashboardBucketId, "document", iosUploadFileIcon), 
                uploadFileAction(this.props.dashboardBucketId, "image", iosUploadPhotoIcon), openCameraAction(props.dashboardBucketId) ];

        this.picturesBucketActions = Platform.OS === "android" 
            ? [ uploadFileAction(this.props.myPhotosBucketId, "", uploadFileIcon), openCameraAction(props.myPhotosBucketId) ]
            : [ uploadFileAction(this.props.myPhotosBucketId, "document", iosUploadFileIcon), 
                uploadFileAction(this.props.myPhotosBucketId, "image", iosUploadPhotoIcon), openCameraAction(props.myPhotosBucketId) ]

        this.downloadListener = (fileParams) => {
            let res = observablePropFactory.getObservable(fileParams.fileId);
            res.Property = fileParams;
        }

        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);

        this.filePickerResponsePathes = [];
    }    

    async componentWillMount () {
        if(Platform.OS === "android") {
            BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress);
        }

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { this.props.disableSelectionMode(); });
    }

    tryDeleteBuckets() {
        Alert.alert(
            'Delete permanently?',
            'Are you sure to delete selected buckets permanently?',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                { text: 'Delete', onPress: () => { this.deleteBuckets(); } }
            ],
            { cancelable: false }
        );
    }

    tryDeleteFiles(bucketId) {
        Alert.alert(
            'Delete permanently?',
            'Are you sure to delete selected files permanently?',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                { text: 'Delete', onPress: () => { this.deleteSelectedFiles(bucketId); } }
            ],
            { cancelable: false }
        );
    }
    
    deleteFile(bucketId, fileId) {        
        ServiceModule.deleteFile(bucketId, fileId);
    }

    deleteSelectedFiles(bucketId) {
        this.props.fileListModels.forEach(fileItem => { 

            if(fileItem.isSelected)
                this.deleteFile(fileItem.entity.bucketId, fileItem.getId());
        });
    }
    
    componentWillUnmount () {
        if(Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress");
        }

        this.keyboardDidShowListener.remove();
    }

    onHardwareBackPress() {
        if(this.props.isLoading)
            return;

        const index = this.props.mainNavReducer.index;
        const routes = this.props.mainNavReducer.routes;   

        if(this.props.isSelectionMode 
        || this.props.isSingleItemSelected 
        || this.props.isActionBarShown) {

            this.props.disableSelectionMode();
        }

        if(routes[index].routeName === "ImageViewerScreen") {
            this.props.redirectToMainScreen();
            return;
        }
    }

    onCreateBucketPress() {
        this.props.showCreateBucketInput();
    }

    onActionBarPress() {
        const index = this.props.mainScreenNavReducer.index;      
        const routes = this.props.mainScreenNavReducer.routes;
        const currentScreen = routes[index].routeName;

        if(currentScreen != "MyAccountScreen") {
            this.props.isActionBarShown ? 
                this.props.hideActionBar() : this.props.showActionBar();
        }
    }

    async bucketScreenUploadFile(type) {
        let filePickerResponse = await filePicker.show(type);
        this.props.hideActionBar();

        if(filePickerResponse.isSuccess) {
            filePickerResponse.result.forEach(file => {
                this.filePickerResponsePathes.push(file.path);
            });

            this._mainComponent.showSelectBuckets(this.getBucketId.bind(this));
        }
    }  

    getBucketId(params) {
        if(params.bucketId) {
            this.filePickerResponsePathes.forEach(element => {
                ServiceModule.uploadFile(params.bucketId, element);
            });  
        }

        this.filePickerResponsePathes = [];
        this._mainComponent.showSelectBuckets();
    }

    async uploadFileToSelectedBuckets(type) {
        let filePickerResponse = await filePicker.show(type);
        this.props.hideActionBar();

        if(filePickerResponse.isSuccess) {
            filePickerResponse.result.forEach(file =>{
                this.getSelectedItems(this.props.buckets).forEach(item => {
                    ServiceModule.uploadFile(item.getId(), file.path);
                });
            })
        }
    }

    async uploadFile(bucketId, type) {
        let filePickerResponse = await filePicker.show(type);
        this.props.hideActionBar();

        if(filePickerResponse.isSuccess) {
            filePickerResponse.result.forEach(file => ServiceModule.uploadFile(bucketId, file.path));
        }
    }

    async downloadFile(file, localPath) {    
        ServiceModule.downloadFile(file.entity.bucketId, file.getId(), localPath);
    }

    async downloadSelectedFiles() {
        this.props.fileListModels.forEach(async fileItem => {
            if(fileItem.isSelected) {
                let result = await StorjModule.getDownloadFolderPath();

                this.downloadFile(fileItem, result + "/" + fileItem.getName());
            }
        });
    }

    async createBucket(name) {   
        ServiceModule.createBucket(name);        
    }

    async deleteBucket(bucket) {
        ServiceModule.deleteBucket(bucket.getId());
    }

    async updateBucketsStarred(bucketsArray, starredStatus) {
        let updatedItems = []; 

        for(var i = 0; i < bucketsArray.length; i++) {
            var item = bucketsArray[i];
            let updateStarredResponse = await SyncModule.updateBucketStarred(item.getId(), starredStatus);

            if(updateStarredResponse.isSuccess) {
                updatedItems.push(item);
            }    
        }

        this.props.updateFavourite(updatedItems, starredStatus);  
    }

    areFavoritesExists(array) {
        if(!array) return false;

        return array.filter(item => {return item.entity.isStarred === true}).length !== 0;
    } 

    setFavourite() {
        let selectedBuckets = this.getSelectedItems(this.props.buckets);

        if(this.areFavoritesExists(selectedBuckets)) {
            this.updateBucketsStarred(selectedBuckets, false);
            return;
        }

        this.updateBucketsStarred(selectedBuckets, true);     
    }

    async updateFilesStarred(filesArray, starredStatus) {
        let updatedItems = [];        

        for(var i = 0; i < filesArray.length; i++) {
            var item = filesArray[i];
            let updateStarredResponse = await SyncModule.updateFileStarred(item.getId(), starredStatus);

            if(updateStarredResponse.isSuccess) {
                updatedItems.push(item);
            }    
        }

        this.props.updateFavouriteFiles(updatedItems, starredStatus);
    }

    getSelectedItems(array) {
        if(!array) return 0;

        return array.filter(item => item.isSelected === true);
    }

    setFavouriteFiles() {        
        let selectedFiles = this.getSelectedItems(this.props.fileListModels);

        if(this.areFavoritesExists(selectedFiles)) {
            this.updateFilesStarred(selectedFiles, false);
            return;
        }
        
        this.updateFilesStarred(selectedFiles, true);  
    }

    deleteBuckets() {
        this.getSelectedItems(this.props.buckets).forEach(item => {
            if(item.getName() === PICTURES) return; //TODO: we shoul add some notification here

            this.deleteBucket(item);
        });

        if(this.props.isSingleItemSelected)
            this.props.disableSelectionMode();
    }

    static navigationOptions = {
        header: null
    };

    tryCopySelectedFiles() {
        this._mainComponent.showSelectBuckets(this.copySelectedFiles.bind(this));
    }

    copySelectedFiles(params) {
        let bucketId = params.bucketId;
        
        if(bucketId) {
            let selectedFiles = this.props.fileListModels.filter(fileItem => fileItem.isSelected);

            selectedFiles.forEach(async fileItem => {
                if(fileItem.entity.isDownloaded) {
                    ServiceModule.uploadFile(bucketId, fileItem.entity.localPath);
                } else {
                    let result = await StorjModule.getDownloadFolderPath();
                    ServiceModule.copyFile(fileItem.entity.bucketId, fileItem.getId(), result + "/" + fileItem.getName(), bucketId);
                }
            });
        }
        this._mainComponent.showSelectBuckets();
    }

    selectAll(bucketId, isFavoritesBuckets) {
        if(bucketId) {
            this.props.selectFiles(bucketId);
            return;
        }

        this.props.selectBuckets(isFavoritesBuckets);
    }

    deselectAll() {
        this.props.disableSelectionMode();
        this.props.deselectFiles();
        this.props.deselectBuckets();
    }

    getTapBarActions() {  
        const isSelectionMode = this.props.isSelectionMode || this.props.isSingleItemSelected;
        const index = this.props.mainScreenNavReducer.index;      
        const routes = this.props.mainScreenNavReducer.routes;
        const currentScreen = routes[index].routeName;

        const dashboardIndex = this.props.dashboardNavReducer.index;
        const dashboardRoutes = this.props.dashboardNavReducer.routes;
        const currentDashboardScreen = dashboardRoutes[dashboardIndex].routeName;

        switch(currentScreen) {
            case "DashboardScreen":
                const dashboardActions = handleDashboardScreenActions(
                    this.props.dashboardBucketId, 
                    isSelectionMode, 
                    this.dashboardBucketActions, 
                    this.selectionFileActions,
                    this.selectionBucketActions,
                    currentDashboardScreen);

                if(dashboardActions) return dashboardActions;

                break;
            case "BucketsScreen":
                const actions = handleScreenActions(
                    this.props.openedBucketId, 
                    isSelectionMode, 
                    this.openedBucketActions, 
                    this.selectionFileActions);

                if(actions) return actions;

                break;
            case "MyPhotosScreen":
                const picturesActions = handleScreenActions(
                    this.props.myPhotosBucketId, 
                    isSelectionMode, 
                    this.picturesBucketActions, 
                    this.selectionFileActions);

                if(picturesActions) return picturesActions;

                break;
        }

        if(this.props.isSelectionMode || this.props.isSingleItemSelected) return this.selectionBucketActions;

        return this.bucketActions;
    };

    async getBuckets(sortingMode) {
		let bucketsResponse = await SyncModule.listBuckets(sortingMode);

        if(bucketsResponse.isSuccess) {
            let buckets = JSON.parse(bucketsResponse.result).map((file) => {
                return new ListItemModel(new BucketModel(file));
            });                    

			ServiceModule.createBaseBuckets(buckets);

            this.props.getBuckets(buckets);
        }
    }
    
    async getFiles(sortingMode) {
        let filesResponse = await SyncModule.listFiles(this.props.openedBucketId, sortingMode);		

        if(filesResponse.isSuccess) {
            let files = JSON.parse(filesResponse.result).map((file) => {
                return new ListItemModel(new FileModel(file));
            });                    
            this.props.listFiles(this.props.openedBucketId, files);
        }
    }

    async deletePIN() {
        await StorjModule.importKeys(
            this.props.email,
            this.props.password,
            this.props.mnemonic,
            '');
    }

    render() {
        const index = this.props.bucketsScreenNavReducer.index;      
        const routes = this.props.bucketsScreenNavReducer.routes;

        return(
            <MainComponent
                ref = { component => this._mainComponent = component }
                getBuckets = { this.getBuckets.bind(this) }
                getFiles = { this.getFiles.bind(this) }
                getBucketId = { this.getBucketId.bind(this) }
                redirectToInitializationScreen = { this.props.redirectToInitializationScreen.bind(this) }
                redirectToPinCodeGenerationScreen = { this.props.redirectToPinCodeGenerationScreen }
                isGridViewShown = { this.props.isGridViewShown }
                setGridView = { this.props.setGridView }
                setListView = { this.props.setListView }
                bucketScreenRouteName = { routes[index].routeName }
                createBucket = { this.createBucket.bind(this) }
                hideCreateBucketInput = { this.props.hideCreateBucketInput }
                tapBarActions = { this.getTapBarActions() } 
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                onActionBarPress = { () => { this.onActionBarPress(); } }
                isActionBarShown = { this.props.isActionBarShown } 
                isCreateBucketInputShown = { this.props.isCreateBucketInputShown }
                wallets = { this.props.wallets }
                isLoading = { this.props.isLoading }
                createWallet = { this.props.createWallet } 
                getWallets = { this.props.getWallets }
                buckets = { this.props.buckets }
                openBucket = { this.props.openBucket }
                bucketNavigateBack = { this.props.bucketNavigateBack }
                setSorting = { this.props.setSorting }
                dashboardNavigateBack = { this.props.dashboardNavigateBack }
                email = { this.props.email }
                password = { this.props.password }
                mnemonic = { this.props.mnemonic }
                selectAll = { this.selectAll.bind(this) }
                deselectAll = { this.deselectAll.bind(this) }
                changePINOptionStatus = { this.props.changePINOptionStatus }
                changePasswordPopupStatus = { this.props.changePasswordPopupStatus }
                isPinOptionsShown = { this.props.isPinOptionsShown }
                isChangePasswordPopupShown = { this.props.isChangePasswordPopupShown }
                deletePIN = { this.deletePIN.bind(this) } />
        );
    }
}

function handleScreenActions(bucketId, isSelection, actions, selectionModeActions) {
    if(!bucketId) {
        return null;
    }

    let result = null;

    if(isSelection) {
        result = selectionModeActions;
    } else {
        result = actions;
    }

    return result;
}

function handleDashboardScreenActions(bucketId, isSelection, actions, selectionModeActions, selectionModeBucketActions, currentScreen) {
    let result = null;

    if(isSelection) {
        result = currentScreen === "FavoriteBucketsScreen" ? selectionModeBucketActions : selectionModeActions;
    } else if(bucketId) {
        result = actions;
    }

    return result;
}

function mapStateToProps(state) { 
    let isStarredBucketsSelected = state.bucketReducer.buckets.filter(item => item.isSelected === true).filter(item => item.entity.isStarred === true).length !== 0; 
    let isStarredFilesSelected = state.filesReducer.fileListModels.filter(item => item.isSelected === true).filter(item => item.entity.isStarred === true).length !== 0;

    return {
        email: state.authReducer.user.email,
        password: state.authReducer.user.password,
        mnemonic: state.authReducer.user.mnemonic,
        dashboardNavReducer: state.dashboardScreenNavReducer,
        bucketsScreenNavReducer: state.bucketsScreenNavReducer,
        mainNavReducer: state.navReducer,
        mainScreenNavReducer: state.mainScreenNavReducer,
        fileListModels: state.filesReducer.fileListModels,
        openedBucketId: state.mainReducer.openedBucketId,
        dashboardBucketId: state.mainReducer.dashboardBucketId,
        myPhotosBucketId: state.mainReducer.myPhotosBucketId,
        isSelectionMode: state.mainReducer.isSelectionMode, 
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        isActionBarShown: state.mainReducer.isActionBarShown,
        buckets: state.bucketReducer.buckets,
        isCreateBucketInputShown: state.mainReducer.isCreateBucketInputShown,
        isFirstSignIn: state.mainReducer.isFirstSignIn,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,
        wallets: state.billingReducer.wallets,
        isStarredBucketsSelected,
        isStarredFilesSelected,
        isPinOptionsShown: state.mainReducer.isPinOptionsShown,
        isChangePasswordPopupShown: state.mainReducer.isChangePasswordPopupShown
    };
}
function mapDispatchToProps(dispatch) { 
    return {
        ...bindActionCreators({ 
            redirectToMainScreen, 
            redirectToInitializationScreen,
            bucketNavigateBack, 
            dashboardNavigateBack,
            redirectToPinCodeGenerationScreen,
            showActionBar,
            hideActionBar,
            showCreateBucketInput,
            hideCreateBucketInput,
            setGridView,
            setListView,
            openBucket,
            selectBuckets,
            selectFiles,
            deselectBuckets,
            deselectFiles,
            listFiles,
            setSorting,
            enableSelectionMode,
            disableSelectionMode,
            createBucket,
            deleteBucket, 
            deleteFile, 
            updateFavourite, 
            updateFavouriteFiles,
            createWallet,
            getWallets,
            getBuckets,
            changePINOptionStatus,
            changePasswordPopupStatus
        }, dispatch)    
    };    
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);