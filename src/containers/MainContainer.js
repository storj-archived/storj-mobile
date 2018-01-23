import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { mainContainerActions } from '../reducers/mainContainer/mainReducerActions';
import StorjLib from '../utils/StorjModule';
import MainComponent from '../components/MainComponent';

class MainContainer extends Component {
    constructor(props) {
        super(props);
    };

    onActionBarPress() {
        this.props.state.isActionBarShown ? 
            this.props.hideActionBar() : this.props.showActionBar();
    };

    async createBucket(bucketName) {
        let createBucketResponse = await StorjLib.createBucket(bucketName);

        console.log('createBucket', createBucketResponse);

        if(createBucketResponse && createBucketResponse.isSuccess) {
            this.props.createBucket(createBucketResponse.bucket);
        }
    };

    deleteBucket() {};

    async getBuckets() {
        let buckets = await StorjLib.getBuckets();
        /* console.log(buckets); */
        this.props.getBuckets(buckets);
    };

    async componentDidMount() {
        await StorjLib.importKeys(
            'yar.vorobiov@gmail.com', 
            'testpassword', 
            'explain coil family embody good dentist okay flat govern ship honey mango comfort onion trade divide asset motion affair crime cycle office arrest agree',
            'testpasscode');

        await this.getBuckets();
    };

    static navigationOptions = {
        header: null
    };

    render() {
        return(
            <MainComponent
                disableSelectionMode = { this.props.disableSelectionMode }
                isSelectionMode = { this.props.state.isSelectionMode }
                currentRoute = { this.props.navState.routes[this.props.navState.index].routeName }
                buckets = { this.props.state.buckets }
                createBucket = { (bucketName) => { this.createBucket(bucketName); } }
                selectedBuckets = { this.props.state.selectedBuckets }
                onActionBarPress = { () => { this.onActionBarPress(); } } 
                isActionBarShown = { this.props.state.isActionBarShown } />
        );
    };
}

function mapStateToProps(state) { return { state: state.mainReducer, navState: state.mainScreenNavReducer }; };
function mapDispatchToProps(dispatch) { return bindActionCreators(mainContainerActions, dispatch); };

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);

MainContainer.PropTypes = {
    main: PropTypes.object
};