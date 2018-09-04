import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../../utils/adaptive';

export default class BalanceReportComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.contentContainer }>
                    <Text style = { styles.amountText }>{ this.props.amount }</Text>
                    <View style = { styles.flexRow }>
                        <Text style = { styles.dateText }>{ this.props.date }</Text>
                    </View>
                </View>
                <View style = { styles.underline }/>
            </View>
        );
    }
}

BalanceReportComponent.propTypes = {
    amount: PropTypes.string,
    date: PropTypes.string
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    contentContainer: {
        height: getHeight(55),
        paddingTop: getHeight(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flexRow: {
        flexDirection: 'row'
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    expanderIconContainer: {
        height: getHeight(24),
        width: getWidth(24),
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    expanderIcon: {
        height: getHeight(12),
        width: getWidth(7)
    },
    amountText:{
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        color: '#384B65'
    },
    dateText:{
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        color: 'rgba(56, 75, 101, 0.4)',
        marginRight: getWidth(10)
    },
    underline: {
        height: 0.5,
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    }
});
