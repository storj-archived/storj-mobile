import {} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketsContainerActions } from '../reducers/mainContainer/mainReducerActions';
import BucketsComponent from '../components/BucketsComponent';
import FirstSignInComponent from '../components/FirstSignInComponent';
import StorjLib from '../utils/StorjModule';
import ListItemModel from '../models/ListItemModel';
import { getFirstSignIn } from '../utils/AsyncStorageModule';

class BucketsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        }
    }

    getSelectedBucketsCount() {
        let count = 0;

        this.props.buckets.map(item => {
            if(item.isSelected) {
                count++;
            }
        });

        return count;
    }

    async createBucket(name) {
        this.props.setLoading();

        try {
            let createBucketResult = await StorjLib.createBucket(name);

            if(createBucketResult.isSuccess) {
                this.props.createBucket(new ListItemModel(createBucketResult.result));
                this.props.removeFirstSignIn();
            } 
        } catch (e) {
            console.log(e);
        }

        this.props.unsetLoading();
    }

    render() {
        if(this.props.isFirstSignIn) {
            return(
                <FirstSignInComponent
                    removeFirstSignIn = { this.props.removeFirstSignIn }
                    createBucket = { this.createBucket.bind(this)} />
            );
        } else {
            return(
                <BucketsComponent
                    onSingleItemSelected = { this.props.onSingleItemSelected }
                    enableSelectionMode = { this.props.enableSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    isSelectionMode = { this.props.isSelectionMode }
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    deselectBucket = { this.props.deselectBucket }
                    selectBucket = { this.props.selectBucket }
                    selectedBucketsCount = { this.getSelectedBucketsCount() }
                    buckets = { this.props.buckets } /> 
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        isSelectionMode: state.mainReducer.isSelectionMode,        
        buckets: state.mainReducer.buckets,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        isFirstSignIn: state.mainReducer.isFirstSignIn
    };
}
    
function mapDispatchToProps(dispatch) {
    return bindActionCreators(bucketsContainerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsContainer);

//TODO: Add prop types