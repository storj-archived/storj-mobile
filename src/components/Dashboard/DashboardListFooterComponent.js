import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import { getHeight, getWidth } from '../../utils/adaptive';

export default class DashboardListFooterComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <TouchableOpacity onPress = { this.props.onPress }>
                <View style = { footerLinkStyles.container }>
                    <View style = { footerLinkStyles.contentContainer }>
                        <Text style = { footerLinkStyles.titleText }>2 more...</Text>
                        <View style = { footerLinkStyles.flexRow } >
                            <Image 
                                style = { footerLinkStyles.expandImage } 
                                source = { require('../../images/DashboardScreen/BlueVector.png') } 
                                resizeMode = 'contain' />
                        </View>
                    </View>
                </View>
                <View style = { footerLinkStyles.underLine }></View>
            </TouchableOpacity>
        )
    }
}

const footerLinkStyles = StyleSheet.create({
    container: {
        height: getHeight(54),
        marginHorizontal: getWidth(10)
    },
    contentContainer: { 
        marginTop: getHeight(20), 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16), 
        color: '#2794FF'
    },
    expandImage: {
        height: getHeight(12), 
        width: getWidth(7), 
        marginLeft: getWidth(10)
    },
    underLine: { 
        height: 1, 
        backgroundColor: 'rgba(56, 75, 101, 0.2)' 
    }
})