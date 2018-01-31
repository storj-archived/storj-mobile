import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../components/ListComponent';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';

export default class BucketsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerFlex: 1
        };

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <ListComponent
                    onSingleItemSelected = { this.props.onSingleItemSelected }                    
                    animatedScrollValue = { this.animatedScrollValue }
                    enableSelectionMode = { this.props.enableSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    isSelectionMode = { this.props.isSelectionMode }
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    deselectItem = { this.props.deselectBucket }
                    selectItem = { this.props.selectBucket }
                    data = { this.props.buckets }
                    bucketsCount = { this.props.buckets.length } />

                <BucketsScreenHeaderComponent
                    isSelectionMode = { this.props.isSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    selectedBucketsCount = { this.props.selectedBucketsCount }
                    animatedScrollValue = { this.animatedScrollValue } />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});
