import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';

export default class MainScreenHeaderComponent extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return(
            <View style={ styles.headerContainer }>
                <Text>Header</Text>
                <Text>{ 'Current route name: ' + this.props.currentRoute }</Text>
                <Text>{ 'Number of buckets listed: ' + this.props.buckets.length }</Text>
                {
                    this.props.isSelectionMode ? <Text onPress = { this.props.disableSelectionMode }>Disable</Text> : null
                }
            </View>
        );
    };
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 80,
        backgroundColor: 'yellow'
    }
});