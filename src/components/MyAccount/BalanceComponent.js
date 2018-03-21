import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';
import BalanceReportComponent from './BalanceReportComponent';
import moment from 'moment';

export default class BalanceComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.topContainer } >
                    <View style = { styles.contentContainer } >
                        <TouchableOpacity 
                            style = { styles.backButton }
                            onPress = { () => { this.props.navigation.goBack(); } } >
                            <Image 
                                source = { require('../../images/MyAccount/BackButton.png') }
                                style = { styles.icon }
                                resizeMode = 'contain' />
                        </TouchableOpacity>
                        <View style = { styles.infoTextContainer }>
                            <Text style = { styles.storageText }>Balance</Text>
                            <Text style = { styles.storageAmountText }>$100.50</Text>
                        </View>
                        <TouchableOpacity 
                            style = { styles.addCreditButton }
                            onPress = { this.props.screenProps.showCredits }
                             > 
                            <Text style = { styles.addCreditText } >Add credits...</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = { styles.explanationContainer }>
                    <Text style = { styles.explanationText }>Billing history</Text>
                </View>
                <ScrollView style = { styles.scrollViewContainer }>                    
                    {
                        this.props.screenProps.transactionList.map(transaction => {
                            return <BalanceReportComponent 
                                        date = { moment(transaction.timestamp).format('MMMM-DD-YYYY') }
                                        amount = { transaction.amount } />
                        })
                    }                                                            
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#FFFFFF'
    },
    topContainer: { 
        height: getHeight(90), 
        backgroundColor: '#2794FF', 
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6 
    },
    contentContainer: {
        flexDirection: 'row',
        marginTop: getHeight(15),
        paddingHorizontal: getWidth(20)
    },
    backButton: {
        marginTop: getHeight(6)
    },
    infoButton: {
        // alignSelf: 'flex-end',
        marginTop: getHeight(6),
        marginLeft: getWidth(50)
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    infoTextContainer: {
        marginLeft: getWidth(20)
    },
    flexRow: {
        flexDirection: 'row'
    },
    storageText: {
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#FFFFFF'
    },
    storageAmountText: {
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(30), 
        lineHeight: getHeight(33),
        color: '#FFFFFF'
    },
    extraText: {
        fontFamily: 'Montserrat-Medium', 
        fontSize: getHeight(14), 
        color: '#A8CEFF'
    },
    extraContainer: {
        marginLeft: getWidth(20), 
        alignSelf: 'flex-end'
    },
    progressFull: {
        marginTop: getHeight(23), 
        height: getHeight(5), 
        backgroundColor: 'rgba(56, 75, 101, 0.2)', 
        marginHorizontal: getWidth(20)
    },
    filledProgress: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: getWidth(210),
        height: getHeight(5), 
        backgroundColor: '#FFFFFF', 
    },
    limitContainer: {
        width: getWidth(158),
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginLeft: getWidth(20),
        height: getHeight(23)
    },
    limitText: {
        fontFamily: 'Montserrat-Medium', 
        fontSize: getHeight(12), 
        lineHeight: getHeight(15),
        color: '#A8CEFF',
        marginTop: getHeight(6),
        marginRight: getWidth(7)
    },
    limit: {
        marginTop: getHeight(-5),
        height: getHeight(25),
        width: getWidth(2),
        backgroundColor: '#A8CEFF'
    },
    explanationContainer: {
        height: getHeight(54),
        marginTop: getHeight(10),
        justifyContent: 'center',
        paddingHorizontal: getWidth(20)
    },
    explanationText: {
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(14), 
        lineHeight: getHeight(17),
        color: 'rgba(56, 75, 101, 0.4)',
    },
    scrollViewContainer: {
        paddingHorizontal: getWidth(20)
    },
    addCreditButton: {
        width: getWidth(115),
        height: getHeight(30),
        marginLeft: getWidth(50),
        borderRadius: 6,
        borderWidth: getWidth(1.5),
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addCreditText: {
        fontFamily: 'Montserrat-SemiBold', 
        fontSize: getHeight(14), 
        color: 'white'
    }
});
