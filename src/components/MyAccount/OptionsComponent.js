import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import React from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';
import PropTypes from 'prop-types';

export default OptionsComponent = (props) => {

    return(
        <TouchableOpacity onPress = { props.onPress }>
            <View style = { styles.mainContainer }>
                <View style = { styles.flexRow }>
                    <Image style = { styles.icon } source = { props.imageSource } resizeMode = 'contain' />
                    <Text style = { styles.titleText }>{ props.title }</Text>
                </View>
                <Image style = { styles.expanderIcon } source = { require('../../images/DashboardScreen/BlueVector.png') }/>
            </View>
        </TouchableOpacity>
    );
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
        height: getHeight(22),
        width: getWidth(22)
    },
    expanderIcon: {
        height: getHeight(12),
        width: getWidth(7)
    },
    titleText:{
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        color: '#384B65',
        marginLeft: getWidth(20)
    }
});

OptionsComponent.propTypes = {
    imageSource: PropTypes.number,
    onPress: PropTypes.func,
    title: PropTypes.string
}