import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../utils/adaptive';

export default class PinOptionComponent extends Component {
    constructor(props) {
        super(props)

        this.closeView = this.closeView.bind(this);
        this.onChangePin = this.onChangePin.bind(this);
        this.onDeletePin = this.onDeletePin.bind(this);
    }

    /**
     * Function that close pop-up
     */
    closeView() {
        this.props.changePINOptionStatus(false);
    }

    /**
     * Pop-up item
     * @param {string} title title to show
     * @param {Function} onPress 
     * @param {object/number} style additional style to text if needed
     */
    renderOptionItem(title, onPress, style) {
        return(
            <TouchableOpacity style = { styles.itemContainer } onPress = { onPress } >
                <View style = { styles.marginLabel }>
                    <Text style = { [styles.labelText, style] }>{ title }</Text>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * Alert and after new importKeys without PIN
     */
    tryDeletePIN() {
        Alert.alert(
            'Remove PIN?',
            'You’ll have to use login/password instead',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'Remove PIN', onPress: async () => { await this.props.deletePIN() } }
            ],
            { cancelable: false }
        );
    }

    onChangePin() {
        this.props.redirectToPinCodeGenerationScreen(); 
        this.closeView();
    }

    onDeletePin() {
        this.tryDeletePIN(); 
        this.closeView();
    }

    render() {
        return(
            <View style = { [ styles.backgroundWrapper ] }>  
                <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { this.closeView } />
                <View style = { styles.mainContainer } >
                    {
                        this.renderOptionItem("Change PIN", this.onChangePin)
                    }
                    {
                        this.renderOptionItem("Delete PIN", this.onDeletePin, styles.redTextColor)
                    }
                </View>
            </View>
        )
    }
}

PinOptionComponent.propTypes = {
    changePINOptionStatus: PropTypes.func,
    redirectToPinCodeGenerationScreen: PropTypes.func,
    deletePIN: PropTypes.func
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        alignSelf: 'center',
        borderRadius: 6,
        position: 'absolute',
        bottom: getHeight(10)
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
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: getHeight(55), 
        borderBottomWidth: 0.5, 
        borderBottomColor: 'rgba(56, 75, 101, 0.2)'
    },
    labelText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        lineHeight: getHeight(19),
        color: '#2794FF'
    },
    marginLabel: {
        marginLeft: getWidth(15)
    },
    redTextColor: {
        color: '#EB5757'
    }
});