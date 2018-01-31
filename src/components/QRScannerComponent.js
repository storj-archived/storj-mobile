import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Alert,
    ActivityIndicator
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

        this.navigateBack = this.props.navigateBack ? this.props.navigateBack : () => {};
        this.onBarCodeRead = this.props.onBarCodeRead ? this.props.onBarCodeRead : () => {};
	};

	render() {
		return(
			<View style={ styles.mainContainer }>
                <TouchableOpacity onPressOut = { this.navigateBack } style = { { width: 30, height: 30, backgroundColor: 'red' } }>
                    <Text>BACK</Text>
                </TouchableOpacity>
                {
                    this.props.viewAppear ?
                        <Barcode style = { styles.barCodeContainer } 
                        ref = { component => this._barCode = component }
                        onBarCodeRead = {this.onBarCodeRead}/> : <Text>Some error</Text>
                }
                
                {
                    this.props.isLoading ?
                        <View style = { [ styles.backgoundWrapper ] }>
                            <View style = { [ styles.backgoundWrapper, styles.dimBlack ] } />
                            <View style = { [ styles.backgoundWrapper, styles.setChildCenter ] }>
                                <ActivityIndicator animating = { true } color = { "#2782ff" } size = { "large" }/>
                            </View>
                        </View> : null
                }
			</View>
		);
	};
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    barCodeContainer: {
        width: getDeviceWidth(), 
        height: getDeviceHeight(), 
        backgroundColor: 'transparent'
    },
    backgoundWrapper: {
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
    }
});

/**
 * Checking QRScannerComponent correct prop types
 */
QRScannerComponent.propTypes = {
};
