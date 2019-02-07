import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    ProgressBarAndroid,
    ProgressViewIOS,
    Platform
} from 'react-native';
import PhotoView from 'react-native-photo-view';
import React from 'react';
import { getDeviceWidth, getDeviceHeight, getWidth, getHeight } from '../../utils/adaptive';
import ActionBar from '../ActionBarComponent';
import Button from "../Common/ButtonComponent";
import PropTypes from 'prop-types';

export default ImageViewerComponent = (props) => {

    onPress = async () => {
        await props.onShare(props.fileUri.uri);
    };

    //Pass uri through screen props
    return(
        <TouchableWithoutFeedback style = { backgroundColor = "transparent" } onPress = { props.showActionBar ? props.onOptionsPress : null }>
            <View style = { styles.mainContainer} >
                <View style = { [ styles.backgroundWrapper, { opacity: 0.93 } ] } />
                {
                    props.isDownloaded ? 
                        <PhotoView
                            source = { props.fileUri }
                            minimumZoomScale = { 1 }
                            maximumZoomScale = { 3 }
                            androidScaleType = "fitCenter"
                            style = { styles.image } />
                        : Platform.select({
                            ios: 
                                <ProgressViewIOS 
                                    style = { { width: getDeviceWidth() } }
                                    progress = { props.progress }
                                    trackTintColor = { '#f2f2f2' }
                                    progressTintColor = { '#2794ff' } />,
                            android:
                                <ProgressBarAndroid    
                                    progress = { props.progress } 
                                    styleAttr = { 'Horizontal' } 
                                    color = { '#2794FF' } 
                                    animating = { true } 
                                    indeterminate = { false } />
                        })
                }
                <View style = { [ styles.buttonWrapper, styles.topButtonsWrapper ] }>
                    <View style = { styles.backgroundWrapper } />
                    <Button 
                        onPress = { props.onBackPress }
                        source = { require("../../images/Icons/ImageViewer/back.png") } />
                    <Button 
                        onPress = { props.onOptionsPress }
                        source = { require("../../images/Icons/ImageViewer/options.png") } />
                </View>
                <View style = { [ styles.buttonWrapper, styles.bottomButtonWrapper ] }>
                    {
                        props.showActionBar ? 
                            null :
                            <View style = { styles.backgroundWrapper } />      
                    }
                    {
                        props.showActionBar ? 
                            <ActionBar 
                                actions = { props.actionBarActions } /> :
                            <Button
                                onPress = { onPress }
                                source = { require("../../images/Icons/ImageViewer/whiteExport.png") } />
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>   
    );
}

ImageViewerComponent.propTypes = {
    actionBarActions: PropTypes.array,
    buckets: PropTypes.array,
    fileUri: PropTypes.object,
    isDownloaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    onBackPress: PropTypes.func,
    onOptionsPress: PropTypes.func,
    onShare: PropTypes.func,
    progress: PropTypes.number,
    showActionBar: PropTypes.bool
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
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