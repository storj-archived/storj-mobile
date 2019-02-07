import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import React from 'react';
import { getHeight, getWidth } from '../../../utils/adaptive';
import StorageReportComponent from './StorageReportComponent';
import { uuidv4 } from '../../../utils/utils';
import PropTypes from 'prop-types';
import moment from 'moment';

export default StorageComponent = (props) => {

    renderTransactions = () => {
        return props.screenProps.transactionList.map(transaction => {                            
            return <StorageReportComponent 
                        key = { uuidv4() }
                        date = { moment(transaction.timestamp).format('MMMM-DD-YYYY') }
                        amount = { transaction.amount } />
        })
    };

    return(
        <View style = { styles.mainContainer }>
            <View style = { styles.topContainer } >
                <View style = { styles.contentContainer } >
                    <TouchableOpacity 
                        style = { styles.backButton }
                        onPress = { props.screenProps.redirectToMyAccountScreen } >
                        <Image 
                            source = { require('../../../images/MyAccount/BackButton.png') }
                            style = { styles.icon }
                            resizeMode = 'contain' />
                    </TouchableOpacity>
                    <View style = { styles.infoTextContainer }>
                        <Text style = { styles.storageText }>Storage</Text>
                        <View style = { styles.flexRow }>
                            <Text style = { styles.storageAmountText }>40.20 GB</Text>
                            <View style = { styles.extraContainer }>
                                <Text style = { styles.extraText }>15.2 GB paid</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style = { styles.infoButton } onPress = { props.screenProps.showStorageInfo }>
                        <Image 
                            source = { require('../../../images/MyAccount/StorageInfo.png') }
                            style = { styles.icon } 
                            resizeMode = 'contain' />
                    </TouchableOpacity>
                </View>
                <View style = { styles.progressFull }>
                    <View style = { styles.filledProgress }/>
                </View>
                <View style = { styles.limitContainer }>
                    <Text style = { styles.limitText }>25 GB free</Text>
                    <View style = { styles.limit } />
                </View>
            </View>
            <View style = { styles.explanationContainer }>
                <Text style = { styles.explanationText }>Storage using history</Text>
            </View>
            <ScrollView style = { styles.scrollViewContainer } decelerationRate = { 'normal' } >
                {
                    renderTransactions()
                }            
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#FFFFFF'
    },
    topContainer: { 
        height: getHeight(130), 
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
        marginTop: getHeight(6),
        marginLeft: getWidth(20)
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
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#FFFFFF'
    },
    storageAmountText: {
        fontFamily: 'montserrat_bold', 
        fontSize: getHeight(30), 
        lineHeight: getHeight(33),
        color: '#FFFFFF'
    },
    extraText: {
        fontFamily: 'montserrat_medium', 
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
        fontFamily: 'montserrat_medium', 
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
        fontFamily: 'montserrat_regular', 
        fontSize: getHeight(14), 
        lineHeight: getHeight(17),
        color: 'rgba(56, 75, 101, 0.4)',
    },
    scrollViewContainer: {
        paddingHorizontal: getWidth(20)
    }
});

StorageComponent.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object
};