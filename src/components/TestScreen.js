import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter,
    BackHandler,
    Platform
} from 'react-native';
import React, { Component } from 'react';
import filePicker from '../utils/filePicker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { navigateBack } from '../reducers/navigation/navigationActions';
import { filesListContainerActions } from '../reducers/mainContainer/mainReducerActions';
import ListComponent from '../components/ListComponent';
import ListItemModel from '../models/ListItemModel';
import storj from '../utils/StorjModule';

class TestComponent extends Component {
    constructor(props) {
        super(props);

        this.onHardwareBackPress = () => {
            this.props.closeBucket();
            this.props.navigateBack();
        };

        this.state = {
            files: []
        };

        this.bucketId = props.navigation.state.params.bucketId;
    }

    componentDidMount() {
        this.listfiles();
    }
    
    componentDidUpdate() {
        //console.log(this.props.files);
    }

    async listfiles() {
        let filesResponse = await storj.listFiles(this.bucketId);

        if(filesResponse.isSuccess) {
            let mappedResult = filesResponse.result.map((file => new ListItemModel(file)));
            this.props.listFiles({ bucketId: this.bucketId, files: mappedResult });
        }
    }

    componentWillMount() {
		if(Platform.OS === 'android') {
			BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
	}

	componentWillUnmount() {
		if(Platform.OS === 'android') {
			BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
	}

    render() {
        let data = [];

        console.log(this.props.files);

        this.props.files.forEach(element => {
            if(element.bucketId === this.bucketId) {
                data = element.files;
            }
        });

        return(
            <View style = { styles.mainContainer }>
                <ListComponent
                    onPress = { () => {} }
                    onSingleItemSelected = { () => {} }                    
                    animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                    enableSelectionMode = { () => {} }
                    disableSelectionMode = { () => {} }
                    isSelectionMode = { false }
                    isSingleItemSelected = { false }
                    deselectItem = { () => {} }
                    selectItem = { () => {} }
                    data = { data }
                    bucketsCount = { data.length } />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        files: state.mainReducer.files
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ navigateBack, ...filesListContainerActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});