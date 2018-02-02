import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
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
    
    chooseLayout = () => {
        switch(this.props.layout) {
            case 'scanning': {
                return(
                    <View style = { [ styles.backgoundWrapper, { justifyContent: 'center', alignItems: 'center', flexDirection: 'column' } ] }>
                        <View style = { { marginTop: getHeight(30) } }>
                            <Image source = { require('../images/Icons/BackButton.png') }/>
                        </View>
                        <View style = { { marginTop: getHeight(139) } }>
                            <Image source = { require('../images/QRScannerScreen/DefaultBorder.png') }/>
                        </View>
                    </View>
                )
            }
            break;
            case 'error': {
                return(
                    <View style = { [ styles.backgoundWrapper, { justifyContent: 'center', alignItems: 'center', flexDirection: 'column' } ] }>
                        <View style = { { marginTop: getHeight(30) } }>
                            <Image source = { require('../images/Icons/BackButton.png') }/>
                        </View>
                        <View style = { { marginTop: getHeight(139) } }>
                            <Image source = { require('../images/QRScannerScreen/ErrorBorder.png') }/>
                        </View>
                        <View style = { { marginTop: getHeight(114) } }>
                            <Image source = { require('../images/QRScannerScreen/ErrorMessage.png') }/>
                        </View>
                    </View>
                )
            }
            break;
            case 'success': {
                return(
                    <View style = { [ styles.backgoundWrapper, { justifyContent: 'center', alignItems: 'center', flexDirection: 'column' } ] }>
                        <View style = { { marginTop: getHeight(30) } }>
                            <Image source = { require('../images/Icons/BackButton.png') }/>
                        </View>
                        <View style = { { marginTop: getHeight(139) } }>
                            <Image source = { require('../images/QRScannerScreen/SuccessBorder.png') }/>
                        </View>
                    </View>
                )
            }
            break;
            default: null
            break;
        }
    }

	render() {
		return(
			<View style={ styles.mainContainer }>
                {
                    this.props.viewAppear ?
                        <Barcode 
                        scannerRectCornerColor = { 'green' }
                        style = { styles.barCodeContainer } 
                        ref = { component => this._barCode = component }
                        onBarCodeRead = {this.onBarCodeRead}/> : <Text>Some error</Text>
                }
                {
                    <View style = { [ styles.backgoundWrapper, { alignItems: 'center', flexDirection: 'column' } ] }>
                        <View style = { { marginTop: getHeight(30), flexDirection: 'row', backgroundColor: 'green'} }>
                            <Image style = { { width: getWidth(24), height: getHeight(24), marginLeft: getWidth(20) } } source = { require('../images/Icons/BackButton.png') }/>
                            <Image style = { { width: getWidth(24), height: getHeight(36),  } } source = { require('../images/Icons/Flash.png') }/>
                            <Image style = { { width: getWidth(30), height: getHeight(30),  } } source = { require('../images/Icons/SwitchCamera.png') }/>
                        </View>
                    </View>
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
