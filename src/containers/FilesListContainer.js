import { BackHandler, Platform, DeviceEventEmitter, Animated } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { navigateBack } from '../reducers/navigation/navigationActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import StorjModule from '../utils/StorjModule';
import ListItemModel from '../models/ListItemModel';
import FilesListComponent from '../components/FilesListComponent';

class FilesListContainer extends Component {
    constructor(props) {
        super(props);

        this.bucketId = props.navigation.state.params.bucketId;
        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
    }

    componentWillMount() {
        if(Platform.OS === "android") {
            BackHandler.addEventListener("hardwarebackPress", this.onHardwareBackPress);
        }

        this.listFiles();

        Animated.timing(
            this.props.screenProps.animatedScrollValue,
            {
              toValue: 0,
              useNativeDriver: true
            }
        ).start();
    }

    componentWillUnmount() {
        if(Platform.OS === "android") {
            BackHandler.removeEventListener("hardwarebackPress", this.onHardwareBackPress);
        }
    }

    async listFiles() {
        this.props.setLoading();
        
        let filesResponse = await StorjModule.listFiles(this.bucketId);

        if(filesResponse.isSuccess) {
            let mappedResult = filesResponse.result.map((file => new ListItemModel(file)));
            this.props.listFiles(this.bucketId, mappedResult);
        }

        this.props.unsetLoading();
    }

    onHardwareBackPress() {
        if(this.props.isLoading)
            return;

        this.props.closeBucket();
        this.props.navigateBack();
    }

    onPress(params) {
        //Download file  
    }

    render() {
        let data = getFilesFormFileModelList(this.props.fileListModels, this.bucketId);
        let uploadingData = getFilesFormFileModelList(this.props.uploadingFileListModels, this.bucketId);

        return(
            <FilesListComponent
                onPress = { (params) => { this.onPress(params); } }
                bucketId = { this.bucketId }
                data = { data.concat(uploadingData) }
                onSingleItemSelected = { this.props.onSingleItemSelected }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                deselectFile = { this.props.deselectFile }
                selectFile = { this.props.selectFile }
                listFiles = { async () => { await this.listFiles(); } } />
        );
    }
}

function mapStateToProps(state) {
    return {
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        fileListModels: state.filesReducer.fileListModels,
        uploadingFileListModels: state.filesReducer.uploadingFileListModels, //uploadingFileListModels
        isLoading: state.mainReducer.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ navigateBack, ...filesListContainerMainActions, ...filesListContainerFileActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesListContainer);

function getFilesFormFileModelList(fileModelList, bucketId) {
    let files = [];

    fileModelList.forEach(element => {
        if(element.bucketId === bucketId) {
            files = element.files;
        }
    });

    return files;
}