import {
    View,
    StyleSheet,
    Animated,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import React from 'react';
//import ListComponent from '../components/ListComponent';
import BucketsScreenHeaderComponent from '../Header/BucketsScreenHeaderComponent';
import { getHeight, getWidth } from '../../utils/adaptive';
import PropTypes from 'prop-types';
import BaseListComponent from '../Lists/BaseListComponent';

export default class SelectBucketComponent extends BaseListComponent {
    constructor(props) {
        super(props);

        this.state = { 
            showSelection: false
        };

        this.animatedScrollValue = new Animated.Value(0);

        this.showSelection = this.showSelection.bind(this);
        this.onUploadPress = this.onUploadPress.bind(this);
        this.emptyFunction = () => {};
    }

    getBucketId(bucket) {
        this.props.setBucketIdToCopy(bucket.getId());
    }

    showSelection() {
        this.setState({ showSelection: !this.state.showSelection });
    }

    onUploadPress() {
        this.props.copyFiles({ bucketId: this.props.bucketIdToCopy });
        this.props.openBucket(this.props.bucketIdToCopy);
        this.props.navigateToFilesScreen(this.props.bucketIdToCopy);
        this.props.navigateBack();
    }

    render() {
        this.props.animatedScrollValue = this.animatedScrollValue;

        if(this.state.showSelection)
            return(
                <View style = { styles.backgroundWrapper }>
                    <View style = { [ styles.backgroundWrapper, styles.dimBlack ] }/>
                    <View style = { styles.mainContainer }>
                        <this.ListComponent
                            textComp = { (props) => <Text numberOfLines = { 1 } style = { props.style }>{ this.props.getBucketName(props.children) }</Text> }
                            listItemIcon = { require('../../images/Icons/BucketListItemIcon.png') }
                            cloudListItemIcon = { require('../../images/Icons/CloudBucket.png') }
                            contentWrapperStyle = { styles.contentWrapper }
                            searchSubSequence = { this.props.searchSubSequence }
                            isListActionsDisabled = { this.props.isListActionsDisabled } />

                        <BucketsScreenHeaderComponent
                            setDashboardBucketId = { this.emptyFunction }
                            isSelectBucketScreen = { true }
                            buckets = { this.props.buckets }
                            selectItem = { this.emptyFunction }
                            showOptions = { this.props.showOptions }
                            navigateBack = { this.props.navigateBack }
                            deselectItem = { this.emptyFunction }     
                            isSelectionMode = { false }
                            openedBucketId = { null }
                            animatedScrollValue = { this.animatedScrollValue }
                            enableSelectionMode = { this.emptyFunction }
                            disableSelectionMode = { this.emptyFunction }  
                            onSingleItemSelected = { this.emptyFunction }  
                            isSingleItemSelected = { this.emptyFunction } 
                            setSearch = { this.props.setSearch }
                            clearSearch = { this.props.clearSearch }
                            searchIndex = { this.props.searchIndex }/>
                    </View>
                </View>
            );

        return(
            <View style = { styles.backgroundWrapper }>
                <TouchableOpacity 
                    style = { [ styles.backgroundWrapper, styles.dimBlack ] } 
                    onPress = { this.props.navigateBack }>
                    <View />
                </TouchableOpacity>
                <View style = { styles.preselectContainer }>
                    <View style = { styles.titleContainer }>
                        <Text style = { styles.titleText }>Where to upload?</Text>
                    </View>
                    <View style = {[ styles.bucketContainer, styles.textPadding ]}>
                        <View style = { styles.flexRow }>
                            <Image 
                                source = { require('../../images/Icons/CloudBucket.png') }
                                style = { styles.icon }
                                resizeMode = 'contain' />
                            <Text style = { styles.bucketNameText }>{this.props.bucketToCopyName}</Text>
                        </View>
                        <Image 
                            source = { require('../../images/Icons/BlueCheck.png') }
                            style = { styles.icon }
                            resizeMode = 'contain' />
                    </View>
                    <View style = { styles.underLine }></View>
                    <TouchableOpacity onPress = { this.showSelection }>
                        <View style = {[ styles.bucketContainer, styles.textPadding ]}> 
                            <Text style = { styles.blueText }>Select another bucket...</Text>  
                            <Image 
                                source = { require('../../images/DashboardScreen/BlueVector.png') }
                                style = { styles.expandIcon }
                                resizeMode = 'contain' />
                        </View>
                    </TouchableOpacity>
                    <View style = { styles.underLine }></View>
                    <TouchableOpacity 
                        style = { styles.uploadButton } 
                        onPress = { this.onUploadPress } >
                        <Text style = { styles.uploadText }>Upload</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: getHeight(20), 
        bottom: getHeight(10),
        right: getWidth(10),
        left: getWidth(10),
        borderWidth: getWidth(1),
        borderRadius: getWidth(6),
        borderColor: '#FFFFFF'
    },
    contentWrapper: {
        paddingTop: getHeight(58),
        paddingBottom: getHeight(60)
    },
    backgroundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.2
    },
    preselectContainer: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: getHeight(10),
        right: getWidth(10),
        left: getWidth(10),
        borderWidth: getWidth(1),
        borderRadius: getWidth(6),
        borderColor: '#FFFFFF',
        paddingHorizontal: getWidth(10),
        paddingBottom: getHeight(10)
    },
    titleContainer: {
        height: getHeight(50),
        justifyContent: 'center'
    },
    underLine: {
        marginHorizontal: getWidth(10),
        height: 0.5,
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    },
    titleText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(16),
        color: '#384B65',
        alignSelf: 'center'
    },
    blueText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        color: '#2794FF'
    },
    marginLeftText: {
        marginLeft: getWidth(15)
    },
    textPadding: {
        paddingHorizontal: getWidth(20)
    },
    uploadButton: {
        marginTop: getHeight(20),
        width: getWidth(335),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2794FF',
        borderRadius: getWidth(6),
        alignSelf: 'center'
    },
    uploadText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(16),
        color: 'white'
    },
    flexRow: {
        flexDirection: 'row'
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    bucketNameText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        color: '#384B65',
        marginLeft: getWidth(10)
    },
    bucketContainer: {
        height: getHeight(50),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    expandIcon: {
        height: getHeight(12),
        width: getWidth(7)
    }
});

SelectBucketComponent.propTypes = {
    activeScreen: PropTypes.string,
    animatedScrollValue: PropTypes.object,
    buckets: PropTypes.array,
    deselectBucket: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    enableSelectionMode: PropTypes.func,
    isGridViewShown: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    onPress: PropTypes.func,
    onSingleItemSelected: PropTypes.func,
    refresh: PropTypes.func,
    selectBucket: PropTypes.func,
    selectedItemId: PropTypes.string,
    setSelectionId: PropTypes.func
};