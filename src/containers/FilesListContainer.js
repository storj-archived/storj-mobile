import { BackHandler, Platform } from 'react-native';
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

    render() {
        let data = [];

        this.props.fileListModels.forEach(element => {
            if(element.bucketId === this.bucketId) {
                data = element.files;
            }
        });

        return(
            <FilesListComponent
                data = { data }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                listFiles = { async () => { await this.listFiles(); } } />
        );
    }
}

function mapStateToProps(state) {
    return {
        fileListModels: state.filesReducer.fileListModels,
        isLoading: state.mainReducer.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ navigateBack, ...filesListContainerMainActions, ...filesListContainerFileActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesListContainer);