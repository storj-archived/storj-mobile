import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { getHeight, getWidth } from '../../utils/adaptive';

export default PopUpComponent = (props) => {

    hidePasswordPopUp = () => {
        props.changePasswordPopupStatus(false);
    };

    return(
        <View style = { [ styles.backgroundWrapper ] }>  
            <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { hidePasswordPopUp } />
            <View style = { styles.popUpContainer } >
                <Text style = { styles.popUpInfoText } >{ props.message }</Text>
                <TouchableOpacity onPress = { hidePasswordPopUp } >
                    <Text style = { styles.popUpCancelText }>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    popUpContainer: {
        position: 'absolute',
        bottom: getHeight(10),
        alignSelf: 'center',
        width: getWidth(355),
        height: getHeight(55),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderRadius: getWidth(6),
        borderWidth: getWidth(1.5),
        elevation: 5,
        paddingHorizontal: getWidth(20)
    },
    popUpInfoText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#384B65',
        elevation: 5
    },
    popUpCancelText: {
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#2794FF'
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
    }
});