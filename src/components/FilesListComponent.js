import {
    View,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../components/ListComponent';

export default class FilesListComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <ListComponent
                    onPress = { () => {} }
                    onSingleItemSelected = { () => {} }                    
                    animatedScrollValue = { this.props.animatedScrollValue }
                    enableSelectionMode = { () => {} }
                    disableSelectionMode = { () => {} }
                    isSelectionMode = { false }
                    isSingleItemSelected = { false }
                    deselectItem = { () => {} }
                    selectItem = { () => {} }
                    data = { this.props.data }
                    bucketsCount = { this.props.data.length } />
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