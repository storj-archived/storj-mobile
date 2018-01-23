import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import React, { Component } from 'react';
import ListItemModel from '../models/ListItemModel';
import ListComponent from '../components/ListComponent';

export default class BucketsComponent extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return(
            <View>
                <ListComponent
                    enableSelectionMode = { this.props.screenProps.enableSelectionMode }
                    isSelectionMode = { this.props.screenProps.isSelectionMode }
                    deselectItem = { this.props.screenProps.deselectBucket }
                    selectItem = { this.props.screenProps.selectBucket }
                    selectedItems = { this.props.screenProps.selectedBuckets }
                    data = { this.props.screenProps.buckets.map((item) => new ListItemModel(item, 'name', 'id', ['name', 'size', 'date'])) } />
            </View>
        );
    };
}
