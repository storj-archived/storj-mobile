import {} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketsContainerActions } from '../reducers/mainContainer/mainReducerActions';
import BucketsComponent from '../components/BucketsComponent';

class BucketsContainer extends Component {
    constructor(props) {
        super(props);
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

    render() {
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

function mapStateToProps(state) {
    return {
        isSelectionMode: state.mainReducer.isSelectionMode,        
        buckets: state.mainReducer.buckets,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected
    };
}
    
function mapDispatchToProps(dispatch) {
    return bindActionCreators(bucketsContainerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsContainer);

//TODO: Add prop types