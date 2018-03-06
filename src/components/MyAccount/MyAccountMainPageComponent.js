import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';

export default class MyAccountMainPageComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { { height: getHeight(30), backgroundColor: '#EB5757' } }>
                    <Text></Text>
                </View>
                <View style = { styles.scrollViewContainer }>
                    {/* <StatusBar backgroundColor = '#EB5757'/> */}
                    <ScrollView showsVerticalScrollIndicator = { false } >
                        <View style = { styles.topButtonsContainer }>
                            <TouchableOpacity onPress = { () => {} } >
                                <View style = { styles.button }>
                                    <View style = { styles.buttonContentContainer }>
                                        <Image 
                                            style = { styles.buttonImage } 
                                            source = { require('../../images/DashboardScreen/Storage.png') } 
                                            resizeMode = 'contain' />
                                        <View >
                                            <Text style = { styles.buttonTextRegular }>Storage</Text>
                                            <Text style = { styles.buttonTextBold }>{ this.props.storageAmount ? this.props.storageAmount : '00.00' }{ ' GB' }</Text>
                                        </View>
                                        <Image 
                                            style = { styles.expandImage } 
                                            source = { require('../../images/DashboardScreen/Vector.png') } 
                                            resizeMode = 'contain' />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress = { () => {} } >
                                <View style = { styles.button }>
                                    <View style = { styles.buttonContentContainer }>
                                        <Image 
                                            style = { styles.buttonImage } 
                                            source = { require('../../images/DashboardScreen/Bandwidth.png') } 
                                            resizeMode = 'contain' />
                                        <View >
                                            <Text style = { styles.buttonTextRegular }>Bandwidth</Text>
                                            <Text style = { styles.buttonTextBold }>{ this.props.bandwidthAmount ? this.props.bandwidthAmount : '0.00' }{ ' GB' }</Text>
                                        </View>
                                        <Image 
                                            style = { styles.expandImage } 
                                            source = { require('../../images/DashboardScreen/Vector.png') } 
                                            resizeMode = 'contain' />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
    scrollViewContainer: { 
        marginTop: getHeight(80), 
        marginHorizontal: getWidth(10) 
    },
    topButtonsContainer: { 
        marginHorizontal: getWidth(10),
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    button: { 
        height: getHeight(70), 
        width: getWidth(163), 
        backgroundColor: '#2794FF', 
        borderRadius: 6, 
        borderWidth: 1, 
        borderColor: '#2794FF' 
    },
    buttonContentContainer: { 
        marginTop: getHeight(15), 
        marginHorizontal: getWidth(15), 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    buttonImage: { 
        height: getHeight(24), 
        width: getWidth(24) 
    },
    buttonTextRegular: { 
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        color: '#FFFFFF' 
    },
    buttonTextBold: { 
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20), 
        color: '#FFFFFF' 
    },
    expandImage: { 
        height: getHeight(12), 
        width: getWidth(7), 
        marginTop: getHeight(5) 
    }
});
