import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';
import PropTypes from 'prop-types';

export default class SettingsComponent extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer } >
                <View style = { styles.topContainer } >
                    <View style = { styles.topContentContainer } >
                        <TouchableOpacity 
                            onPress = { this.props.screenProps.redirectToMyAccountScreen }
                            style = { styles.backButtonContainer } >
                            <Image 
                                source = { require('../../images/MyAccount/BlueBackButton.png') }
                                style = { styles.icon } />
                        </TouchableOpacity>
                        <Text style = { [styles.titleText, styles.titleMargin] }>Settings</Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator = { false } decelerationRate = { 'normal' } >
                    <View style = { styles.explanationContainer }>
                        <Text style = { styles.explanationText }>Sync options</Text>
                    </View>
                    <View style = { styles.optionsContainer }>
                        <Text style = { styles.switchText }>Sync on</Text>
                        <Switch 
                            onTintColor = { '#2794FF' } 
                            tintColor = { 'rgba(56, 75, 101, 0.2)' } 
                            onValueChange = { () => { this.props.changeSyncStatus(!this.props.syncStatus); } }
                            value = { this.props.syncStatus } />
                    </View>
                    <View style = { styles.underline }/>
                    <View style = { styles.optionsContainer }>
                        <Text style = { styles.switchText }>Wi-Fi only</Text>
                        <Switch 
                            onTintColor = { '#2794FF' } 
                            tintColor = { 'rgba(56, 75, 101, 0.2)' } 
                            onValueChange = { () => { this.props.setWifiConstraint(!this.props.onWifi, this.props.getStateObject()); } }
                            value = { this.props.onWifi } />
                    </View>
                    <View style = { styles.underline }/>
                    <View style = { styles.optionsContainer }>
                        <Text style = { styles.switchText }>Only when charging</Text>
                        <Switch 
                            onTintColor = { '#2794FF' } 
                            tintColor = { 'rgba(56, 75, 101, 0.2)' } 
                            onValueChange = { () => { this.props.setChargingConstraint(!this.props.onCharging, this.props.getStateObject()); } }
                            value = { this.props.onCharging } />
                    </View>
                    <View style = { styles.underline }/>
                    {/* <View style = { styles.checkboxPhotosContainer }>
                        <TouchableOpacity 
                                onPress = { () => { this.props.syncPhotosAction(!this.props.syncPhotos, this.props.getStateObject()); } }
                                style = { styles.flexRow } >
                                <Image 
                                    style = { styles.icon }
                                    resizeMode = 'contain'
                                    source = { 
                                        this.props.syncPhotos 
                                        ? require('../../images/Icons/ListItemSelected.png')
                                        : require('../../images/Icons/ListItemUnselected.png') }/>
                        
                            <Text style = { [ styles.switchText, styles.checkboxTextMargin ] } >Sync photos and videos</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = { styles.underline }/> */}
                    {/* <View style = { styles.checkboxPhotosContainer }>
                        <TouchableOpacity 
                            onPress = { () => { this.props.syncDocumentsAction(!this.props.syncDocuments, this.props.getStateObject()); } }
                            style = { styles.flexRow } >
                            <Image 
                                style = { styles.icon } 
                                resizeMode = 'contain'
                                source = { 
                                    this.props.syncDocuments 
                                    ? require('../../images/Icons/ListItemSelected.png')
                                    : require('../../images/Icons/ListItemUnselected.png') } />
                        
                            <Text style = { [ styles.switchText, styles.checkboxTextMargin ] } >Sync documents</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style = { styles.explanationContainer }>
                        <Text style = { styles.explanationText }>Security</Text>
                    </View>
                    {/* <TouchableOpacity style = { styles.optionsContainer } onPress = { this.props.screenProps.redirectToMyAccountMnemonicScreen }>
                        <Text style = { styles.switchText }>Secret phrase</Text>
                        <View style = { styles.expanderIconContainer }>
                            <Image
                                source = { require('../../images/DashboardScreen/BlueVector.png') }
                                style = { styles.expanderIcon } />
                        </View>
                    </TouchableOpacity> */}
                    <View style = { styles.underline }/>
                    <TouchableOpacity style = { styles.optionsContainer } onPress = { this.props.screenProps.redirectToChangePasswordScreen } >
                        <Text style = { styles.switchText }>Change password</Text>
                        <View style = { styles.expanderIconContainer }>
                            <Image
                                source = { require('../../images/DashboardScreen/BlueVector.png') }
                                style = { styles.expanderIcon } />
                        </View>
                    </TouchableOpacity>
                    <View style = { styles.underline }/>
                    <TouchableOpacity style = { styles.optionsContainer } onPress = { () => this.props.changePINOptionStatus(true) } >
                        <Text style = { styles.switchText }>Change PIN</Text>
                        <View style = { styles.expanderIconContainer }>
                            <Image
                                source = { require('../../images/DashboardScreen/BlueVector.png') }
                                style = { styles.expanderIcon } />
                        </View>
                    </TouchableOpacity>
                    <View style = { styles.bottomPadding }/>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor: '#FFFFFF',
        paddingHorizontal: getWidth(20)
    },
    topContainer: {
        height: getHeight(55)
    },
    topContentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: getHeight(10),
        height: getHeight(40)
    },
    backButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: { 
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(28), 
        lineHeight: getHeight(33),
        color: '#384B65' 
    },
    titleMargin: {
        marginLeft: getWidth(20),
    },
    icon: {
        height: getHeight(24),
        width: getWidth(24)
    },
    explanationText: {
        fontFamily: 'Montserrat-Regular', 
        marginTop: getHeight(10),
        fontSize: getHeight(14), 
        lineHeight: getHeight(17),
        color: 'rgba(56, 75, 101, 0.4)',
    },
    explanationContainer: {
        height: getHeight(54),
        justifyContent: 'center'
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: getHeight(55)
    },
    switchText: {
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        lineHeight: getHeight(20),
        color: '#384B65' 
    },
    checkboxPhotosContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: getHeight(55)
    },
    checkboxFilesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: getHeight(55)
    },
    checkboxTextMargin: {
       marginLeft: getWidth(15) 
    },
    flexRow: {
        flexDirection: 'row'
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
    underline: {
        height: 0.5,
        backgroundColor: 'rgba(56, 75, 101, 0.2)'
    },
    deleteAccountButton: { 
        width: getWidth(335),
        height: getHeight(50),
        borderRadius: 6,
        marginTop: getHeight(35),
        borderWidth: getWidth(1.5),
        borderColor: '#EB5757',
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteAccountText: { 
        fontFamily: 'Montserrat-SemiBold', 
        fontSize: getHeight(16), 
        color: '#EB5757' 
    },
    bottomPadding: {
        height: getHeight(70)
    }
});

SettingsComponent.propTypes = {
    changeSyncStatus: PropTypes.func,
    email: PropTypes.string,
    getStateObject: PropTypes.func,
    navigation: PropTypes.object,
    onCharging: PropTypes.bool,
    onWifi: PropTypes.bool,
    screenProps: PropTypes.object,
    setChargingConstraint: PropTypes.func,
    setWifiConstraint: PropTypes.func,
    syncDocuments: PropTypes.bool,
    syncDocumentsAction: PropTypes.func,
    syncMovies: PropTypes.bool,
    syncMoviesAction: PropTypes.func,
    syncMusic: PropTypes.bool,
    syncMusicAction: PropTypes.func,
    syncPhotos: PropTypes.bool,
    syncPhotosAction: PropTypes.func,
    syncStatus: PropTypes.bool
};