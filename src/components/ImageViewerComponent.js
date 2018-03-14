import {
    Image,
    View,
    StyleSheet,
    TouchableOpacity
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
            <View style = { styles.mainContainer} >
                <View style = { styles.backgroundWrapper } />
                <PhotoView
                    source = { this.props.imageUri }
                    minimumZoomScale={ 1 }
                    maximumZoomScale={ 3 }
                    androidScaleType="fitCenter"
                    style = { styles.image } />

                <View style = { [ styles.buttonWrapper, styles.topButtonsWrapper ] }>
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
                            <ActionBar 
                                actions = { this.props.actionBarActions } /> :
                            <Button  
                                source = { require("../images/Icons/ImageViewer/share.png") } />       
                    }
                </View>
            </View>
            
        );
    }
}

const Button = (props) => (
    <TouchableOpacity onPress = { props.onPress }>
        <Image source = { props.source } />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    buttonWrapper: {
        position: "absolute",
        backgroundColor: 'transparent',
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
        width: getDeviceWidth(),
        height: getDeviceHeight()
    },
    backgroundWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.7
    }
});