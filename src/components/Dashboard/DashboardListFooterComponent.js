import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import { getHeight, getWidth } from '../../utils/adaptive';
import PropTypes from 'prop-types';

export default DashboardListFooterComponent = (props) => {
    
    getCount = () => {
        let count = props.count;
        
        if(count > 3) return count - 3;
        if(count <= 3) return '';
    }

    return(
        <TouchableOpacity onPress = { props.onPress }>
            <View style = { footerLinkStyles.container }>
                <View style = { footerLinkStyles.contentContainer }>
                    <Text style = { footerLinkStyles.titleText }>{ getCount() + " more..." } </Text>
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
        fontFamily: 'montserrat_regular',
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
});

DashboardListFooterComponent.propTypes = {
    count: PropTypes.number,
    onPress: PropTypes.func
}