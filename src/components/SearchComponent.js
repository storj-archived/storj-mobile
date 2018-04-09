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
import PropTypes from 'prop-types';
 
export default class SearchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearchIconShown: true,
            searchValue: ''
        };
    }

    getSelectedBucketName() {
        let buckets = this.props.buckets;
        let openedBucket = buckets.find((bucket) => bucket.entity.id == this.props.openedBucketId);

        if(openedBucket) {
            return openedBucket.getName();
        }
    }

    fileScreenHeader() {
        return(
            <View style = { [ styles.rowContainer, this.props.styleContainer ] }>
                <TouchableOpacity onPress = { () => { this.props.navigateBack ? this.props.navigateBack() : () => {} } }>
                    <Image style = { styles.backButton } source = { require("../images/Icons/BackButton.png") } resizeMode = { 'contain' } />
                </TouchableOpacity>
                <View style = { [ styles.rowContainer, styles.mainContainer, styles.fileHeader ] }>
                    <View style = {[ styles.rowContainer, { height: getHeight(50) } ]}>
                        <TextInput
                            onFocus = { () => { this.setState({ isSearchIconShown: false }); } }
                            onBlur = { () => { 
                                if(!this.state.searchValue) {
                                    this.setState({ isSearchIconShown: true }); 
                                }
                            }}
                            placeholder = { this.getSelectedBucketName() }
                            underlineColorAndroid = { 'transparent' } 
                            style = { styles.textInput }
                            onChangeText = { (value) => { this.setState({ searchValue: value }); } } 
                            value = { this.state.searchValue } />
                    </View>
                    <View style = { [ styles.rowContainer, styles.updateStatusContainer ] }>
                        <Text style = { styles.updateStatus }>Just now</Text>
                        <TouchableOpacity onPress = { this.props.showOptions }>
                            <Image style = { styles.image } source = { require("../images/Icons/SearchOptions.png") } resizeMode = { 'contain' } />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        if(this.props.isFilesScreen) {
            return this.fileScreenHeader();
        }
        
        return(
            <View style = { [ styles.rowContainer, styles.mainContainer, this.props.styleContainer ] }>
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
                    <View style = { [ styles.rowContainer, styles.updateStatusContainer ] }>
                        <Text style = { styles.updateStatus }>Update Status</Text>
                        <TouchableOpacity onPress = { this.props.showOptions }>
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
        alignItems: 'center',
        flex: 0.6
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        paddingHorizontal: getWidth(15),
        borderRadius: getHeight(10),
        justifyContent: 'space-between'
    },
    fileHeader: {
        marginLeft: getWidth(16)
    },
    updateStatusContainer: {
        justifyContent: 'flex-end',
        flex: 0.4
    },
    image: {
        width: getHeight(16.5),
        height: getHeight(16.5)
    },
    backButton: {
        width: getHeight(24),
        height: getHeight(24)
    },
    textInput: {
        paddingVertical: 0,
        fontSize: getHeight(16),
        color: '#384B65',
        fontFamily: 'Montserrat-SemiBold',
        flex: 1
    },
    updateStatus: {
        marginRight: getWidth(15),
        fontSize: getHeight(12),
        color: '#384B65',
        fontFamily: 'Montserrat-Regular'
    }
});

SearchComponent.propTypes = {
    buckets: PropTypes.array,
    isFilesScreen: PropTypes.bool,
    navigateBack: PropTypes.func,
    openedBucketId: PropTypes.string,
    showOptions: PropTypes.func,
    styleContainer: PropTypes.number
}; 