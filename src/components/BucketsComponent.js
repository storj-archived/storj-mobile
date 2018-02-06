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
import BucketsScreenNavigation from '../containers/BucketsScreenNavContainer';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';

export default class BucketsComponent extends Component {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <BucketsScreenNavigation
                    animatedScrollValue = { this.animatedScrollValue }  />
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
