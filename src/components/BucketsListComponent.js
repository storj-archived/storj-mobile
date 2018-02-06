import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../components/ListComponent';

export default class BucketsListComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <ListComponent
                    onSingleItemSelected = { this.props.onSingleItemSelected }                    
                    animatedScrollValue = { this.props.animatedScrollValue }
                    enableSelectionMode = { this.props.enableSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    isSelectionMode = { this.props.isSelectionMode }
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    listItemIcon = { require('../images/Icons/BucketItemFolder.png') }
                    deselectItem = { this.props.deselectBucket }
                    selectItem = { this.props.selectBucket }
                    data = { this.props.buckets }
                    bucketsCount = { this.props.buckets.length } />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    }
});