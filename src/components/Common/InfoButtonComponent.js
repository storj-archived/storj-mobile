import { 
    StyleSheet,
    View,
    Image,
    Text 
} from 'react-native';
import React from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';

export const InfoButtonComponent = (props) => {
    return(
        <View style = { styles.button }>
            <View style = { styles.buttonContentContainer }>
                <Image 
                    style = { styles.buttonImage } 
                    source = { props.imagePath } 
                    resizeMode = 'contain' />
                <View style = { styles.bandwidthMargin }>
                    <Text style = { [styles.buttonTextRegular, styles.topButtonTextMargin, styles.blackTextColor] }>{ props.title }</Text>
                    <Text style = { [styles.buttonTextBold, styles.topButtonTextMargin, styles.blackTextColor] }>{ props.amount }{ ' GB' }</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: { 
        height: getHeight(70), 
        width: getWidth(163), 
        backgroundColor: '#EFF1F3', 
        borderRadius: 6, 
        borderWidth: 1,
        borderColor: '#EFF1F3'
    },
    buttonContentContainer: { 
        marginTop: getHeight(15), 
        marginHorizontal: getWidth(15), 
        flexDirection: 'row'
    },
    buttonImage: { 
        height: getHeight(24), 
        width: getWidth(24)
    },
    bandwidthMargin: {
        marginLeft: getWidth(5)
    },
    buttonTextRegular: { 
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        color: '#FFFFFF' 
    },
    topButtonTextMargin: {
        marginLeft: getWidth(10)
    },
    blackTextColor: { 
        color: '#384B65' 
    },
    buttonTextBold: { 
        fontFamily: 'montserrat_bold', 
        fontSize: getHeight(15), 
        lineHeight: getHeight(20), 
        color: '#FFFFFF' 
    }
});