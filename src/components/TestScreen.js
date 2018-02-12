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
import ListComponent from '../components/ListComponent';
import ListItemModel from '../models/ListItemModel';
import storj from '../utils/StorjModule';

class TestComponent extends Component {
    constructor(props) {
        super(props);

        this.onHardwareBackPress = () => {
            this.props.navigateBack();
        };

        this.state = {
            files: []
        };
    }

    async componentDidMount() {
        //console.log(this.props);
        console.log("componentDidMount------------");
        console.log(this.props);
        
        let filesResponse = await storj.listFiles(this.props.navigation.state.params.bucketId);

        console.log(filesResponse);

        let mappedResult = filesResponse.result.map((bucket => new ListItemModel(bucket)));

        console.log(mappedResult);

        this.setState({ files: mappedResult });

        
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
        return(
            <View style = { styles.mainContainer }>
                <ListComponent
                    data = { this.state.files }
                    bucketsCount = { this.state.files.length } />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ navigateBack }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});