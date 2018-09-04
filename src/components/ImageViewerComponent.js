import {
    Image,
    View,
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
import ActionBar from '../components/ActionBarComponent';

export default class ImageViewerComponent extends Component {

    //Pass uri through screen props
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <TouchableWithoutFeedback style = { backgroundColor = "transparent" } onPress = { this.props.showActionBar ? this.props.onOptionsPress : null }>
                <View style = { styles.mainContainer} >
                    <View style = { [ styles.backgroundWrapper, { opacity: 0.93 } ] } />
                    {
                        !this.props.showProgress || this.props.isDownloaded ? 
                            <PhotoView
                                source = { this.props.fileUri }
                                minimumZoomScale={ 1 }
                                maximumZoomScale={ 3 }
                                androidScaleType="fitCenter"
                                style = { styles.image } />
                            : Platform.select({
                                ios: 
                                    <ProgressViewIOS 
                                        style = { { width: getDeviceWidth() } }
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
                            })
                    }
                    <View style = { [ styles.buttonWrapper, styles.topButtonsWrapper ] }>
                        <View style = { styles.backgroundWrapper } />
                        <Button 
                            onPress = { this.props.onBackPress }
                            source = { require("../images/Icons/ImageViewer/back.png") } />
                        <Button 
                            onPress = { this.props.onOptionsPress }
                            source = { require("../images/Icons/ImageViewer/options.png") } />
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
                                    onPress = { async () => { await this.props.onShare(this.props.fileUri.uri); } }
                                    source = { require("../images/Icons/ImageViewer/whiteExport.png") } />       
                        }
                    </View>
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
    <TouchableOpacity onPress = { props.onPress }>
        <Image source = { props.source } />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
        // paddingHorizontal: getWidth(5),
        // paddingVertical: getHeight(10)
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
        ...Platform.select({
            ios: {
                width: getDeviceWidth(),
                height: getDeviceHeight() - getHeight(20)
            },
            android: {
                width: getDeviceWidth() - getWidth(40),
                height: getDeviceHeight()
            }
        })
        
    },
    backgroundWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
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
});