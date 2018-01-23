import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';

export default class ActionBarComponent extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return(
            <View style = { styles.popUpRectangleWrapper }>
                <View style = { styles.popUpRectangle }>
                    {
                        this.props.isSelectionMode ? 
                            <Text>Buckets selected</Text>
                            : <Text onPress={ () => { this.props.createBucket('TestBucket' + Math.random()); } }>Create bucket</Text> 
                    }
                </View>
            </View>
        );
    };
} 

const styles = StyleSheet.create({
    popUpRectangleWrapper: {
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        alignItems: 'center'
    },  
    popUpRectangle: {
        width: 250,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'blue'
    }
});