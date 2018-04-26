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
    disableSelectionMode
} from '../reducers/mainContainer/mainReducerActions';
import {    
    createBucket,
    deleteBucket, 
    updateFavourite,
    selectBuckets,
    deselectBuckets
} from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { 
    deleteFile, 
    updateFavouriteFiles,
    selectFiles,
    deselectFiles
} from '../reducers/mainContainer/Files/filesReducerActions';
import { 
    redirectToMainScreen, 
    redirectToInitializationScreen, 
    bucketNavigateBack, 
    dashboardNavigateBack 
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

const { PICTURES } = SYNC_BUCKETS;

class MainContainer extends Component {
    constructor(props) {
        super(props);

        //this.state = {
        this.bucketActions = [
            //actions for bucket screen
            TabBarActionModelFactory.createNewAction(() => { this.props.showCreateBucketInput(); }, 'Action 1', require('../images/ActionBar/NewBucketIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { this.bucketScreenUploadFile() }, 'Action 2', require('../images/ActionBar/UploadFileIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { CameraModule.openCamera(this.props.myPhotosBucketId); }, 'Action 3', require('../images/ActionBar/UploadPhotoIcon.png'))
        ];

        this.selectionBucketModeActions = [
            //actions for bucket screen
            TabBarActionModelFactory.createNewAction(() => { this.setFavourite(); }, 'Action 4', require('../images/ActionBar/FavoritesIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { this.uploadFileToSelectedBuckets(); }, 'Action 5', require('../images/ActionBar/UploadFileIcon.png')), 
            //TabBarActionModelFactory.createNewAction(() => { }, 'Action 6', require('../images/ActionBar/CopyBucketIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { this.tryDeleteBuckets(); }, 'Action 7', require('../images/ActionBar/TrashBucketIcon.png'))
        ];

        this.selectionFileModeActions = [
            //actions for bucket screen
            TabBarActionModelFactory.createNewAction(() => { this.setFavouriteFiles(); }, 'Action 4', require('../images/ActionBar/FavoritesIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { this.downloadSelectedFiles(); }, 'Action 5', require('../images/ActionBar/DownloadIFileIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { this.tryCopySelectedFiles(); }, 'Action 6', require('../images/ActionBar/CopyBucketIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { this.tryDeleteFiles(); }, 'Action 7', require('../images/ActionBar/TrashBucketIcon.png'))
        ];
        
        this.openedBucketActions = [
            //TabBarActionModelFactory.createNewAction(() => { }, 'Action 8', require('../images/ActionBar/FavoritesIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { this.uploadFile(this.props.openedBucketId); }, 'Action 8', require('../images/ActionBar/UploadFileIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { CameraModule.openCamera(this.props.openedBucketId); }, 'Action 3', require('../images/ActionBar/UploadPhotoIcon.png')) 
            //TabBarActionModelFactory.createNewAction(() => { }, '2', require('../images/ActionBar/DownloadIFileIcon.png')),
            //TabBarActionModelFactory.createNewAction(() => { }, 'Action 9', require('../images/ActionBar/TrashBucketIcon.png'))
        ];

        this.dashboardBucketActions = [
            //TabBarActionModelFactory.createNewAction(() => { }, 'Action 8', require('../images/ActionBar/FavoritesIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { this.uploadFile(this.props.dashboardBucketId); }, 'Action 8', require('../images/ActionBar/UploadFileIcon.png')),
            TabBarActionModelFactory.createNewAction(() => { CameraModule.openCamera(this.props.dashboardBucketId); }, 'Action 3', require('../images/ActionBar/UploadPhotoIcon.png'))
            //TabBarActionModelFactory.createNewAction(() => { }, '2', require('../images/ActionBar/DownloadIFileIcon.png')),
            //TabBarActionModelFactory.createNewAction(() => { }, 'Action 9', require('../images/ActionBar/TrashBucketIcon.png'))
        ];

        this.picturesBucketActions = [
            TabBarActionModelFactory.createNewAction(() => { this.uploadFile(this.props.myPhotosBucketId); }, 'Action 8', require('../images/ActionBar/UploadFileIcon.png')), 
            TabBarActionModelFactory.createNewAction(() => { CameraModule.openCamera(this.props.myPhotosBucketId); }, 'Action 3', require('../images/ActionBar/UploadPhotoIcon.png'))
        ];

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

    async bucketScreenUploadFile() {
        let filePickerResponse = await filePicker.show();
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

    async uploadFileToSelectedBuckets() {
        let filePickerResponse = await filePicker.show();
        this.props.hideActionBar();

        if(filePickerResponse.isSuccess) {
            filePickerResponse.result.forEach(file =>{
                this.getSelectedBuckets().forEach(item => {
                    ServiceModule.uploadFile(item.getId(), file.path);
                });
            })
        }
    }

    async uploadFile(bucketId) {
        let filePickerResponse = await filePicker.show();
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

    deleteFile(bucketId, fileId) {        
        ServiceModule.deleteFile(bucketId, fileId);
    }

    deleteSelectedFiles(bucketId) {
        this.props.fileListModels.forEach(fileItem => { 

            if(fileItem.isSelected)
                this.deleteFile(fileItem.entity.bucketId, fileItem.getId());
        });
    }

    async createBucket(name) {   
        ServiceModule.createBucket(name);        
    }

    async deleteBucket(bucket) {
        ServiceModule.deleteBucket(bucket.getId());
    }

    getSelectedBuckets() {
        let selectedBuckets = [];

        this.props.buckets.map(item => {
            if(item.isSelected) {
                selectedBuckets.push(item);
            }
        });

        return selectedBuckets;
    }

    async setFavourite() {
        let selectedBuckets = this.getSelectedBuckets();
        let length = selectedBuckets.length;
        let updatedItems = [];        

        for(var i = 0; i < length; i++) {
            var item = selectedBuckets[i];
            let updateStarredResponse = await SyncModule.updateBucketStarred(item.getId(), !item.getStarred());

            if(updateStarredResponse.isSuccess) {
                updatedItems.push(item);
            }    
        }

        this.props.updateFavourite(updatedItems);        
    }

    async setFavouriteFiles() {        
        let selectedFiles = this.props.fileListModels.filter(fileItem => {
            return fileItem.isSelected;
        });
        
        let length = selectedFiles.length;          

        let updatedItems = [];        

        for(var i = 0; i < length; i++) {
            var item = selectedFiles[i];
            let updateStarredResponse = await SyncModule.updateFileStarred(item.getId(), !item.getStarred());

            if(updateStarredResponse.isSuccess) {
                updatedItems.push(item);
            }    
        }

        this.props.updateFavouriteFiles(updatedItems);
    }

    deleteBuckets() {
        this.getSelectedBuckets().forEach(item => {
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
                const dashboardActions = handleDashboardScreenActions(this.props.dashboardBucketId, 
                    isSelectionMode, 
                    this.dashboardBucketActions, 
                    this.selectionFileModeActions,
                    this.selectionBucketModeActions,
                    currentDashboardScreen);

                if(dashboardActions)
                    return dashboardActions;

                break;
            case "BucketsScreen":
                const actions = handleScreenActions(this.props.openedBucketId, 
                    isSelectionMode, 
                    this.openedBucketActions, 
                    this.selectionFileModeActions);

                if(actions)
                    return actions;

                break;
            case "MyPhotosScreen":
                const picturesActions = handleScreenActions(this.props.myPhotosBucketId, 
                    isSelectionMode, 
                    this.picturesBucketActions, 
                    this.selectionFileModeActions);

                if(picturesActions)
                    return picturesActions;

                break;
        }

        if(this.props.isSelectionMode || this.props.isSingleItemSelected) {
            return this.selectionBucketModeActions;
        }

        return this.bucketActions;
    };

    render() {
        const index = this.props.bucketsScreenNavReducer.index;      
        const routes = this.props.bucketsScreenNavReducer.routes;

        return(
            <MainComponent
                ref = { component => this._mainComponent = component }
                getBucketId = { this.getBucketId.bind(this) }
                redirectToInitializationScreen = { this.props.redirectToInitializationScreen.bind(this) }
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
                deselectAll = { this.deselectAll.bind(this) } />
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
        wallets: state.billingReducer.wallets
    };
}
function mapDispatchToProps(dispatch) { 
    return {
        ...bindActionCreators({ 
            redirectToMainScreen, 
            redirectToInitializationScreen,
            bucketNavigateBack, 
            dashboardNavigateBack,
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
            setSorting,
            enableSelectionMode,
            disableSelectionMode,
            createBucket,
            deleteBucket, 
            deleteFile, 
            updateFavourite, 
            updateFavouriteFiles,
            createWallet,
            getWallets
        }, dispatch)    
    };    
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);