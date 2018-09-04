import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight } from '../utils/adaptive';

export default class NoInernerComponent extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.contentContainer }>
                    <View style = { styles.titleContainer } >
                        <Text style = { styles.titleText } >No internet connection. </Text>
                        <Text style = { styles.regularText }>We can’t download</Text>
                    </View>
                    <Text style = { styles.regularText }>your buckets.</Text>
                    <View style = { styles.imageContainer }>
                        <Image
                            source = { require('../images/MainScreen/NoInternet.png') }
                            style = { styles.image }
                            resizeMode = 'contain' />
                    </View>
                    <TouchableOpacity onPress = { () => { } }>
                        <View style = { styles.refreshButton } >
                            <Text style = { styles.refreshButtonText }>Refresh</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }   
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
        width: getWidth(335),
        flexDirection: 'row'
    },
    titleText: { 
        fontFamily: 'montserrat_bold', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(23),
        color: '#384B65'
    },
    regularText: { 
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
        marginTop: getHeight(55),
        alignItems: 'center',
        justifyContent: 'center'
    },
    refreshButton: {
        marginTop: getHeight(70),
        alignSelf: 'center',
        width: getWidth(335),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2782ff',
        borderColor: '#2794FF',
        borderRadius: getWidth(6),
        borderWidth: getWidth(1.5)
    },
    refreshButtonText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(14),
        color: 'white'
    },
});