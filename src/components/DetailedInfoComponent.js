import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../utils/adaptive';

export default class PinOptionComponent extends Component {
    constructor(props) {
        super(props)
    }

    renderOptionItem(title, infoText) {
        return(
            <View style = { styles.itemContainer } >
                <Text style = { styles.labelText }>{ title }</Text>
                <Text style = { styles.infoText }>{ infoText }</Text>
            </View>
        )
    }

    renderOptions() {
        const starredIcon = this.props.isStarred ? '★' : null;

        return(
            <View style = { styles.mainContainer } >
                <View style = { [styles.itemContainer, styles.justifyStart] } >
                    <Image style = { styles.icon } source = { require('../images/Icons/FileListItemIcon.png') } resizeMode = { 'contain' } />
                    <View style = { styles.textContainer }>
                        <Text style = { [styles.labelText, styles.nameTextMargin] }>
                            <Text style = { styles.blueStar }>
                                { starredIcon }
                            </Text>
                        { this.props.fileName }</Text>
                    </View>
                </View>
                {
                    this.renderOptionItem('Type', this.props.type)
                }
                {
                    this.renderOptionItem('Size', this.props.size)
                }
                {
                    this.renderOptionItem('Created', new Date(this.props.creationDate).toDateString())
                }
            </View>
        )
    }

    render() {
        return(
            <View style = { [ styles.backgroundWrapper ] }>  
                <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { this.props.showDetailedInfo } />
                {
                    this.renderOptions()
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        alignSelf: 'center',
        borderRadius: 6,
        position: 'absolute',
        bottom: getHeight(10),
        paddingHorizontal: getWidth(20)
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
        borderBottomColor: 'rgba(56, 75, 101, 0.2)',
        justifyContent: 'space-between',
        // paddingHorizontal: getWidth(20)
    },
    labelText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        lineHeight: getHeight(19),
        color: '#384B65'
    },
    infoText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        lineHeight: getHeight(19),
        color: 'rgba(56, 75, 101, 0.4)'
    },
    redTextColor: {
        color: '#EB5757'
    },
    justifyStart: {
        justifyContent: 'flex-start'
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    nameTextMargin: {
        marginLeft: getWidth(12)
    },
    blueStar: {
        fontSize: getHeight(16),
        color: '#2794FF'
    },
    textContainer: {
        justifyContent: 'center',
        width: getWidth(300),
        height: getHeight(50),
        paddingRight: getWidth(12)
    }
});