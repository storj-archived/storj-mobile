import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../utils/adaptive';
 
export default class SearchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearchIconShown: true,
            searchValue: ''
        };
    }

    render() {
        return(
            <View style = { [ styles.rowContainer, styles.mainContainer ] }>
                    <View style = { styles.rowContainer }>
                        { this.state.isSearchIconShown ? <Image style={ styles.image } source = { require("../images/Icons/Search.png") } resizeMode = { 'contain' } /> : null }
                        <TextInput
                            onFocus = { () => { this.setState({ isSearchIconShown: false }); } }
                            onBlur = { () => { 
                                if(!this.state.searchValue) {
                                    this.setState({ isSearchIconShown: true }); 
                                }
                            }}
                            underlineColorAndroid = { 'transparent' } 
                            style = { styles.textInput }
                            onChangeText = { (value) => { this.setState({ searchValue: value }); } } 
                            value = { this.state.searchValue } />
                    </View>
                    <View style = { styles.rowContainer }>
                        <Text style = { styles.updateStatus }>Update Status</Text>
                        <TouchableOpacity>
                            <Image style = { styles.image } source = { require("../images/Icons/SearchOptions.png") } resizeMode = { 'contain' } />
                        </TouchableOpacity>
                    </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        paddingHorizontal: getWidth(15),
        borderRadius: getHeight(10),
        justifyContent: 'space-between'
    },
    image: {
        width: getHeight(16.5),
        height: getHeight(16.5)
    },
    textInput: {
        paddingVertical: 0,
        fontSize: getHeight(16),
        color: '#384B65',
        fontFamily: 'Montserrat-SemiBold'
    },
    updateStatus: {
        marginRight: getWidth(15),
        fontSize: getHeight(12),
        color: '#384B65',
        fontFamily: 'Montserrat-Regular'
    }
});

//TODO: Add prop types