import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../../utils/adaptive';

export default class StorageReportComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.contentContainer }>
                    <Text style = { styles.amountText }>{ this.props.amount + "Gb" }</Text>
                    <Text style = { styles.dateText }>{ this.props.date }</Text>
                </View>
                <View style = { styles.underline }/>
            </View>
        );
    }
}

StorageReportComponent.propTypes = {
    amount: PropTypes.number,
    date: PropTypes.string
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    contentContainer: {
        height: getHeight(55),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    amountText:{
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        color: '#384B65'
    },
    dateText:{
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        color: 'rgba(56, 75, 101, 0.4)',
        marginLeft: getWidth(20)
    },
    underline: {
        height: 0.5,
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    }
});
