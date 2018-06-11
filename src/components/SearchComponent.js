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

    shouldComponentUpdate(nextProps) {
        if(this.props.searchIndex !== nextProps.searchIndex) {
            this.setState({ searchValue: '' });
            this.props.clearSearch(this.props.searchIndex);
        }

        return true;
    }

    getSelectedBucketName() {
        let buckets = this.props.buckets;
        let openedBucket = buckets.find((bucket) => bucket.getId() == this.props.openedBucketId);

        if(openedBucket) {
            return openedBucket.getName();
        }
    }

    onOptionPress() {
        if(this._fileTextInput) this._fileTextInput.blur();

        if(this._bucketTextInput) this._bucketTextInput.blur();

        this.props.showOptions();
    }

    fileScreenHeader() {
        return(
            <View style = { [ styles.rowContainer, this.props.styleContainer ] }>
                <TouchableOpacity style = { styles.backButtonWrapper } onPress = { () => { this.props.navigateBack ? this.props.navigateBack() : () => {} } }>
                    <Image style = { styles.backButton } source = { require("../images/Icons/BackButton.png") } resizeMode = { 'contain' } />
                </TouchableOpacity>
                <View style = { [ styles.rowContainer, styles.mainContainer, styles.fileHeader ] }>
                    <View style = {[ styles.rowContainer, { height: getHeight(50) } ]}>
                        <TextInput
                            ref = { comp => this._fileTextInput = comp }
                            onFocus = { () => { this.setState({ isSearchIconShown: false }); } }
                            onBlur = { () => { 
                                if(!this.state.searchValue) {
                                    this.setState({ isSearchIconShown: true }); 
                                }
                            }}
                            placeholder = { this.state.isSearchIconShown ? this.getSelectedBucketName() : null }
                            placeholderTextColor = { '#000000' }
                            underlineColorAndroid = { 'transparent' } 
                            style = { styles.textInput }
                            onChangeText = { (value) => { 
                                this.props.setSearch(this.props.searchIndex, value); 
                                this.setState({ searchValue: value }); 
                            }} 
                            value = { this.state.searchValue } />
                    </View>
                    <View style = { [ styles.rowContainer, styles.updateStatusContainer ] }>
                        <Text style = { styles.updateStatus }>{ this.props.lastSync }</Text>
                        <TouchableOpacity onPress = { this.onOptionPress.bind(this) }>
                            <Image style = { styles.image } source = { require("../images/Icons/SearchOptions.png") } resizeMode = { 'contain' } />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    selectBucketScreenHeader() {
        return(
            <View style = { [ styles.rowContainer, this.props.styleContainer ] }>
                <TouchableOpacity style = { styles.backButtonWrapper } onPress = { () => { this.props.navigateBack ? this.props.navigateBack() : () => {} } }>
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
                            placeholder = { this.state.isSearchIconShown ? 'Where to upload?' : null }
                            placeholderTextColor = { '#000000' }
                            underlineColorAndroid = { 'transparent' } 
                            style = { styles.textInput }
                            onChangeText = { (value) => { 
                                this.props.setSearch(this.props.searchIndex, value); 
                                this.setState({ searchValue: value }); 
                            }} 
                            value = { this.state.searchValue } />
                    </View>
                    <View style = { [ styles.rowContainer, styles.updateStatusContainer ] }>
                    
                    </View>
                </View>
            </View>
        );
    }

    render() {
        if(this.props.isFilesScreen) {
            return this.fileScreenHeader();
        } else if (this.props.isSelectBucketScreen) {
            return this.selectBucketScreenHeader();
        }
        
        return(
            
            <View style = { [ styles.rowContainer, styles.mainContainer, this.props.styleContainer ] }>
                    <View style = { styles.rowContainer }>
                        { this.state.isSearchIconShown && this.props.placeholder !== 'Pictures' ? <Image style={ styles.searchImage } source = { require("../images/Icons/Search.png") } resizeMode = { 'contain' } /> : null }
                        <TextInput
                            ref = { comp => this._bucketTextInput = comp }
                            onFocus = { () => { this.setState({ isSearchIconShown: false }); } }
                            onBlur = { () => { 
                                if(!this.state.searchValue) {
                                    this.setState({ isSearchIconShown: true }); 
                                }
                            }}
                            placeholder = { this.state.isSearchIconShown ? this.props.placeholder : null }
                            placeholderTextColor = { '#000000' }
                            underlineColorAndroid = { 'transparent' } 
                            style = { styles.textInput }
                            onChangeText = { (value) => { 
                                this.props.setSearch(this.props.searchIndex, value); 
                                this.setState({ searchValue: value }); 
                            }} 
                            value = { this.state.searchValue } />
                    </View>
                    <View style = { [ styles.rowContainer, styles.updateStatusContainer ] }>
                        <Text style = { styles.updateStatus }>{ this.props.lastSync }</Text>
                        <TouchableOpacity onPress = { this.onOptionPress.bind(this) }>
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
        marginLeft: getWidth(5)
    },
    updateStatusContainer: {
        justifyContent: 'flex-end',
        flex: 0.4
    },
    searchImage: {
        height: getHeight(16.5),
        width: getHeight(16.5)
    },
    image: {
        width: getHeight(24),
        height: getHeight(24)
    },
    backButton: {
        width: getHeight(24),
        height: getHeight(24)
    },
    backButtonWrapper: {
        paddingVertical: getHeight(16),
        paddingRight: getWidth(10),
        paddingLeft: getWidth(6)
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
    isSelectBucketScreen: PropTypes.bool,
    isFilesScreen: PropTypes.bool,
    navigateBack: PropTypes.func,
    openedBucketId: PropTypes.string,
    showOptions: PropTypes.func,
    styleContainer: PropTypes.number
}; 