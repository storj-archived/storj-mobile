import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { mainContainerActions } from '../reducers/mainContainer/mainReducerActions';
import ListItemModel from '../models/ListItemModel';
import StorjLib from '../utils/StorjModule';
import TabBarActionModel from '../models/TabBarActionModel';
import MainComponent from '../components/MainComponent';

class MainContainer extends Component {
    constructor(props) {
        super(props);

        //this.state = {
        this.tapBarActions = [
            //actions for bucket screen
            new TabBarActionModel(() => { this.createBucket("Test" + Math.random()); }, 'Action 1', require('../images/Icons/BucketItemFolderAction.png')), 
            new TabBarActionModel(() => { this.deleteBuckets(); }, 'Action 2', require('../images/Icons/TrashBucket.png')),
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
        this.props.isActionBarShown ? 
            this.props.hideActionBar() : this.props.showActionBar();
    };

    async createBucket(bucketName) {
        try {
            let createBucketResponse = await StorjLib.createBucket(bucketName);
            console.log(createBucketResponse);
            if(createBucketResponse.isSuccess) {
                this.props.createBucket(new ListItemModel(createBucketResponse.result));
            }
        } catch(e) {
            //Eror callback
            console.log('errorName: ' + e.name, "// errorMessage: " + e.message, "// errorCode: " + e.code);
        }
    };

    async deleteBucket(bucket) {
        let result = await StorjLib.deleteBucket(bucket.getId());
        console.log(result);
        if(result.isSuccess) {
            this.props.deleteBucket(bucket);
        }
    };

    getSelectedBuckets() {
        let selectedBuckets = [];

        this.props.buckets.map(item => {
            if(item.isSelected) {
                selectedBuckets.push(item);
            }
        });
        
        return selectedBuckets;
    };

    deleteBuckets() {
        this.getSelectedBuckets().forEach(item => {
            this.deleteBucket(item);
        });
    }

    async getBuckets() {
        try {
            let buckets = await StorjLib.getBuckets();

            this.props.getBuckets(buckets.map((bucket => new ListItemModel(bucket))));
        } catch(e) {
            //Eror callback
            console.log('errorName: ' + e.name, "// errorMessage: " + e.message, "// errorCode: " + e.code);
        }
    };

    async componentDidMount() {
        await StorjLib.importKeys(
            'elvy.baila@arockee.com', 
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
                tapBarActions = { [ this.tapBarActions[0], this.tapBarActions[1], this.tapBarActions[2] ] } 
                isSelectionMode = { this.props.isSelectionMode }
                onActionBarPress = { () => { this.onActionBarPress(); } } 
                isActionBarShown = { this.props.isActionBarShown } />
        );
    };
}

function mapStateToProps(state) { 
    return { 
        isSelectionMode: state.mainReducer.isSelectionMode, 
        isActionBarShown: state.mainReducer.isActionBarShown,
        buckets: state.mainReducer.buckets
    };
}
function mapDispatchToProps(dispatch) { return bindActionCreators(mainContainerActions, dispatch); };

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);