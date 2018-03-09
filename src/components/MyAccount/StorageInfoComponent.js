import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../../utils/adaptive';
import myAccountConstants from '../../utils/constants/myAccountConstants';
import { getEmail, getPassword, getMnemonic } from '../../utils/AsyncStorageModule';

export default class StorageInfoComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <View style = { [ styles.backgroundWrapper ] }>  
                <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { this.props.showStorageInfo } />
                    <View style = { styles.mainContainer } >
                        <View style = { styles.infoContainer } >
                            <Text style = { styles.infoText }>{ myAccountConstants.storageInfoText }</Text>
                        </View>
                        <View style = { styles.closeButton }>
                            <TouchableOpacity 
                                onPress = { this.props.showStorageInfo } >
                                    <Image 
                                        style = { styles.icon }
                                        source = { require('../../images/MyAccount/Close.png') }
                                        resizeMode = 'contain' />
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
        )
    }
}

StorageInfoComponent.propTypes = {
    showStorageInfo: PropTypes.func,
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        height: getHeight(547),
        paddingHorizontal: getWidth(10),
        paddingVertical: getHeight(10),
        marginTop: getHeight(90),
        alignSelf: 'center',
        justifyContent: 'space-between',
        borderRadius: 6
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
    infoContainer: {
        marginTop: getHeight(20),
        paddingHorizontal: getWidth(20),
        height: getHeight(400),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    infoText: {
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(15),
        lineHeight: getHeight(23),
        color: '#384B65'
    },
    closeButton: {
        alignSelf: 'center'
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    }
});