import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet
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
    };

    onScrollCallback(value) {
        let res = 1 - (value * 0.5 / 100);
        
        if(this.state.headerFlex != res) {
            this.setState({ headerFlex: res });
        }
    };

    render() {
        return(
            <View style={ styles.mainContainer }>
                <ListComponent
                    onSingleItemSelected = { this.props.onSingleItemSelected }                    
                    enableSelectionMode = { this.props.enableSelectionMode }
                    isSelectionMode = { this.props.isSelectionMode }
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    deselectItem = { this.props.deselectBucket }
                    selectItem = { this.props.selectBucket }
                    data = { this.props.buckets } 
                    onScrollCallback = { (value) => { this.onScrollCallback(value); }} />
                <BucketsScreenHeaderComponent
                    isSelectionMode = { this.props.isSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    selectedBucketsCount = { this.props.selectedBucketsCount } 
                    headerFlex = { this.state.headerFlex } />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});
