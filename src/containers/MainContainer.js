import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { mainContainerActions } from '../reducers/mainContainer/mainReducerActions';
import StorjLib from '../utils/StorjModule';
import TabBarActionModel from '../models/TabBarActionModel';
import MainComponent from '../components/MainComponent';

class MainContainer extends Component {
    constructor(props) {
        super(props);

        //this.state = {
        this.tapBarActions = [
            //actions for bucket screen
            new TabBarActionModel(() => { console.log('Action 1') }, 'Action 1', require('../images/Icons/BucketItemFolderAction.png')), 
            new TabBarActionModel(() => { console.log('Action 2') }, 'Action 2', require('../images/Icons/TrashBucket.png')),
            new TabBarActionModel(() => { console.log('Action 3') }, 'Action 3', require('../images/Icons/CreateBucketIcon.png')), 
            //actions for file screen
            new TabBarActionModel(() => { console.log('Action 4') }, 'Action 4', require('../images/Icons/CreateBucketIcon.png')), 
            new TabBarActionModel(() => { console.log('Action 5') }, 'Action 5', require('../images/Icons/TrashBucket.png')),
            new TabBarActionModel(() => { console.log('Action 6') }, 'Action 6', require('../images/Icons/BucketItemFolderAction.png')), 
            //another actions
            new TabBarActionModel(() => { console.log('Action 7') }, 'Action 7', require('../images/Icons/BucketItemFolderAction.png')), 
            new TabBarActionModel(() => { console.log('Action 8') }, 'Action 8', require('../images/Icons/TrashBucket.png')),
            new TabBarActionModel(() => { console.log('Action 9') }, 'Action 9', require('../images/Icons/CreateBucketIcon.png')), 
        ];
        //};  
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
        console.log(this.props.navState.routes[this.props.navState.index].routeName);
    };

    static navigationOptions = {
        header: null
    };

    render() {
        return(
            <MainComponent
                tapBarActions = { this.props.navState.routes[this.props.navState.index].routeName === 'BucketsScreen' 
                                    ? [ this.tapBarActions[0], this.tapBarActions[1], this.tapBarActions[2] ] 
                                    : [ this.tapBarActions[3], this.tapBarActions[4], this.tapBarActions[5] ] } 
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