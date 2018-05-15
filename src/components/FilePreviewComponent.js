import {
    Image,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    ProgressBarAndroid,
    ProgressViewIOS,
    Platform
} from 'react-native';
import PhotoView from 'react-native-photo-view';
import React, { Component } from 'react';
import { getDeviceWidth, getDeviceHeight, getWidth, getHeight } from '../utils/adaptive';
import { getShortBucketName } from "../utils/fileUtils";
import ActionBar from '../components/ActionBarComponent';
import SelectBucketComponent from '../components/SelectBucketComponent';
import DetailedInfoComponent from '../components/DetailedInfoComponent';

export default class FilePreviewComponent extends Component {

    //Pass uri through screen props
    constructor(props) {
        super(props);

        this.state = {
            isSelectBucketShown: false,
            isDetailedInfoShown: false
        }
    }

    showSelectBuckets(callback) {
        if(callback) {
            this.selectBucketCallback = callback;
        }
        
        this.setState({ isSelectBucketShown: !this.state.isSelectBucketShown })
    }

    showCentralContent() {
        return(
            <View style = { styles.centralContainer }>
                <Image source = { require('../images/Icons/CloudFile.png') } style = { styles.cloudImage } />
                <Text style = { styles.text }>Test text</Text>
                <Text style = { styles.text }>Test text 2</Text>
            </View>
        )
    }

    showDetailedInfo() {
        this.setState({ isDetailedInfoShown: !this.state.isDetailedInfoShown })
    }

    render() {
        return(
            <TouchableWithoutFeedback style = { backgroundColor = "transparent" } onPress = { this.props.showActionBar ? this.props.onOptionsPress : null }>
                <View style = { styles.mainContainer} >
                    <View style = { [ styles.backgroundWrapper, { opacity: 0.93 } ] } />
                    {
                        this.props.isDownloaded ? 
                            this.showCentralContent()
                            : Platform.select({
                                ios: 
                                    <ProgressViewIOS 
                                        progress = { this.props.progress }
                                        trackTintColor = { '#f2f2f2' }
                                        progressTintColor = { '#2794ff' } />,
                                android:
                                    <ProgressBarAndroid    
                                        progress = { this.props.progress } 
                                        styleAttr = { 'Horizontal' } 
                                        color = { '#2794FF' } 
                                        animating = {true} 
                                        indeterminate = { false } />
                            }) //<LoadingComponent isLoading  />
                    }
                    <View style = { [ styles.buttonWrapper, styles.topButtonsWrapper ] }>
                        <View style = { styles.backgroundWrapper } />
                        <Button 
                            onPress = { this.props.onBackPress }
                            source = { require("../images/Icons/BackButton.png") } />
                        <View style = { styles.flexRow }>
                            <Button 
                                onPress = { () => { this.showDetailedInfo() } }
                                source = { require("../images/Icons/BlueInfo.png") } />
                            <Button 
                                style = { styles.searchButtonMargin }
                                onPress = { this.props.onOptionsPress }
                                source = { require("../images/Icons/SearchOptions.png") } />
                        </View>
                    </View>
                    <View style = { [ styles.buttonWrapper, styles.bottomButtonWrapper ] }>
                        {
                            this.props.showActionBar ? 
                                null :
                                <View style = { styles.backgroundWrapper } />      
                        }
                        {
                            this.props.showActionBar ? 
                                <ActionBar 
                                    actions = { this.props.actionBarActions } /> :
                                <Button
                                    onPress = { async () => { await this.props.onShare(this.props.imageUri.uri); } }
                                    source = { require("../images/Icons/BlueShare.png") } />       
                        }
                    </View>
                    {
                        this.state.isSelectBucketShown  
                            ? <SelectBucketComponent
                                getItemSize = { () => {} }
                                isLoading = { false }
                                searchSubSequence = { null }
                                sortingMode = { null }
                                onRefresh = { () => {} }
                                isGridViewShown = { this.props.isGridViewShown }
                                onPress = { (bucket) => { this.selectBucketCallback({ bucketId: bucket.getId() }); } }
                                onLongPress = { () => {} }
                                onDotsPress = { () => {} }
                                onCancelPress = { () => {} }
                                selectedItemId = { null }
                                isSelectionMode = { false }
                                data = { this.props.buckets }
                                getBucketName = { getShortBucketName }
                                
                                showOptions = { () => {} }
                                navigateBack = { this.showSelectBuckets.bind(this) } />
                            : null
                    }
                    {
                        this.state.isDetailedInfoShown 
                            ? <DetailedInfoComponent
                                showDetailedInfo = { this.showDetailedInfo.bind(this) }
                                fileName = { 'testName' }
                                type = { 'testType' }
                                size = { 'testSize' }
                                creationDate = { 'testCreationDate' }
                                updateDate = { 'testUpdateDate' } /> : null
                    }
                </View>
            </TouchableWithoutFeedback>   
        );
    }
}

const LoadingComponent = (props) => (
    <View style = { styles.loadingComponentContainer }>
        <ActivityIndicator animating = { props.isLoading ? true : false } size = { 'large' } color = { 'blue' } />
    </View>
); 

const Button = (props) => (
    <TouchableOpacity onPress = { props.onPress } style = { props.style }>
        <Image source = { props.source } style = { styles.icon } resizeMode = 'contain' />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    buttonWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        height: getHeight(72),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: getWidth(24)
    },
    topButtonsWrapper: {
        top: 0,
        justifyContent: 'space-between'
    },
    bottomButtonWrapper: {
        bottom: 0
    },
    image: {
        backgroundColor: "transparent",
        width: getDeviceWidth(),
        height: getDeviceHeight()
    },
    backgroundWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        opacity: 0.5
    },
    loadingComponentContainer: {
        backgroundColor: 'transparent',
        position: "absolute",
        left: 0,
        right: 0,
        top: getHeight(80),
        height: getHeight(60)
    },
    centralContainer: {
        alignSelf: 'center',
        width: getWidth(150),
        alignItems: 'center'
    },
    cloudImage: {
        height: getHeight(124),
        width: getWidth(103)
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    }, 
    text: {
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(19), 
        color: 'rgba(56, 75, 101, 0.4)'
    },
    flexRow: {
        flexDirection: 'row'
    },
    searchButtonMargin: {
        marginLeft: getWidth(20)
    }
});