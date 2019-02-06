import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import React from 'react';
import { getWidth, getHeight } from '../../utils/adaptive';

export default EmptyBucketComponent = () => {
    
    return(
        <View style = { styles.mainContainer }>
            <View style = { styles.contentContainer }>
                <View style = { styles.titleContainer } >
                    <Text style = { styles.titleText } >Start storing! Add some files here.</Text>
                </View>
                <View style = { styles.imageContainer }>
                    <Image
                        source = { require('../../images/MainScreen/File.png') }
                        style = { styles.image }
                        resizeMode = 'contain' />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#FFFFFF'
    },
    contentContainer: {
        paddingHorizontal: getWidth(20)
    },
    titleContainer: { 
        marginTop: getHeight(90),
        height: getHeight(25),
        width: getWidth(335)
    },
    titleText: { 
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(23),
        color: '#384B65'
    },
    image: {
        height: getHeight(250),
        width: getWidth(375)
    },
    imageContainer: {
        height: getHeight(250),
        marginTop: getHeight(100),
        alignItems: 'center',
        justifyContent: 'center'
    }
});