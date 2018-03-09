import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';

export default class OptionsComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <TouchableOpacity onPress = { () => { this.props.onPress } }>
                <View style = { styles.mainContainer }>
                    <View style = { styles.flexRow }>
                        <Image style = { styles.icon } source = { this.props.imageSource } />
                        <Text style = { styles.titleText }>{ this.props.title }</Text>
                    </View>
                    <Image style = { styles.expanderIcon } source = { require('../../images/DashboardScreen/BlueVector.png') }/>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        height: getHeight(55),
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
    expanderIcon: {
        height: getHeight(12),
        width: getWidth(7)
    },
    titleText:{
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        color: '#384B65',
        marginLeft: getWidth(20)
    }
});
