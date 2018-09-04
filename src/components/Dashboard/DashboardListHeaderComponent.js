import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import { getHeight, getWidth } from '../../utils/adaptive';
import PropTypes from 'prop-types';

export default class DashboardListHeaderComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <TouchableOpacity onPress = { this.props.onPress }>
                <View style = { titleLinkStyles.container }>
                    <View style = { titleLinkStyles.contentContainer }>
                        <Text style = { titleLinkStyles.titleText }>{this.props.title}</Text>
                        <View style = { titleLinkStyles.flexRow } >
                            <Text style = { titleLinkStyles.linkText } >View all</Text>
                            <Image 
                                style = { titleLinkStyles.expandImage } 
                                source = { require('../../images/DashboardScreen/BlueVector.png') } 
                                resizeMode = 'contain' />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const titleLinkStyles = StyleSheet.create({
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
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(14), 
        color: 'rgba(56, 75, 101, 0.4)'
    },
    linkText: {
        fontFamily: 'montserrat_medium',
        fontSize: getHeight(12), 
        color: '#2794FF'
    },
    expandImage: {
        height: getHeight(12), 
        width: getWidth(7), 
        marginLeft: getWidth(10)
    }
});

DashboardListHeaderComponent.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string
}