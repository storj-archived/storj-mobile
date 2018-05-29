import {
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getWidth, getHeight, getDeviceWidth, getDeviceHeight } from '../utils/adaptive';
import Barcode from 'react-native-smart-barcode';

/**
 * QRCodeScannerScreen component
 */
export default class QRScannerComponent extends Component {

	constructor(props) {
        super(props);

        this.state = {
            borderColor: '#FFFFFF'
        }

        this.navigateBack = this.props.navigateBack ? this.props.navigateBack : () => {};
        this.onBarCodeRead = this.props.onBarCodeRead ? this.props.onBarCodeRead : () => {};
    };

    /**
     * Setting border color of qrscanner 
     * @param {String} color 
     */
    setBorderColor(color) {
        this.setState({ borderColor: color })
    }

    /** 
     * ErrorMessageView when login via qr isn`t successful
    */
    showErrorMessage() {
        return(
            <View style = { styles.errorMessageContainer }> 
                <Image 
                    style = { styles.errorMessage }
                    source = { require('../images/QRScannerScreen/ErrorMessage.png') } 
                    resizeMode = 'contain' />
            </View>
        )
    }

    /** 
     * LoadingView when login via qr is successful
    */
    showLoadingView() {
        return(
            <View style = { [ styles.backgroundWrapper ] }>
                <View style = { [ styles.backgroundWrapper, styles.dimBlack ] } />
                <View style = { [ styles.backgroundWrapper, styles.setChildCenter ] }>
                    <ActivityIndicator animating = { true } color = { "#2782ff" } size = { "large" }/>
                </View>
            </View>
        )
    }

	render() {
		return(
			<View style={ styles.mainContainer }>
                {
                    this.props.viewAppear ?
                        <Barcode 
                        scannerRectCornerColor = { this.state.borderColor }
                        style = { styles.barCodeContainer } 
                        ref = { component => this._barCode = component }
                        onBarCodeRead = {this.onBarCodeRead}/> : null
                }
                { 
                    <View style = {  styles.backgroundWrapper  }>
                        <View style = { styles.buttonPanelContainer }>
                            <TouchableOpacity onPress = { () => this.navigateBack() } >
                                <Image style = { styles.backButton } source = { require('../images/Icons/BackButton.png') }/>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.borderColor === '#EB5757' ?
                                this.showErrorMessage() : null
                        }
                    </View>
                }
                {
                    this.state.borderColor === '#27AE60' ?
                        this.showLoadingView() : null
                }
            </View>
            
		);
	};
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    barCodeContainer: {
        width: getDeviceWidth(), 
        height: getDeviceHeight(), 
        backgroundColor: 'transparent'
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
        opacity: 0.3
    },
    setChildCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonPanelContainer: {
        marginTop: getHeight(30), 
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        paddingLeft: getWidth(20), 
        paddingRight: getWidth(20)
    },
    backButton: {
        width: getWidth(24), 
        height: getHeight(24)
    },
    flexRow: {
        flexDirection: 'row'
    }
    errorMessageContainer: {
        marginTop: getHeight(500),
        alignItems: 'center'
    },
    errorMessage: {
        width: getWidth(275),
        height: getHeight(50)
    }
});
