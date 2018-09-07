import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getWidth, getHeight, getDeviceWidth } from '../utils/adaptive';
import PropTypes from 'prop-types';

export default class FirstSignInComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: props.options,
            showModal: false
        }

        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    showModal() {
        this.setState({ showModal: true });
    }

    async closeModal() {
        this.setState({ 
            showModal: false
        });

        let settings = 0;
        let count = 0;
        this.state.options.forEach(option => {
            if (option.isSelected) {
                this.props.createBucket(option.type);
                settings = settings | option.mask;
                count++;
            }
        });

        let shouldActivateSync = count > 0;

        if(shouldActivateSync) {
            settings = settings | this.props.SYNC_ENUM.ON_WIFI;
            settings = settings | this.props.SYNC_ENUM.ON_CHARGING;
        }

        this.props.setFirstSignIn(settings, (result) => {
            shouldActivateSync ? this.props.changeSyncStatus(true) : null;
            this.props.removeFirstSignIn();
        });
    }

    changeOptions = (type) => {
        let oldValues = this.state.options;
        
        this.setState({ options: oldValues.map(value => {
            if(value.type === type) value.isSelected = !value.isSelected;
            return value;
        })});
    }

    getCallback = (type) => {
        switch(type) {
            case 'Pictures': this.photosSelection();
            break;
            case 'Movies': this.videosSelection();
            break;
            case 'Documents': this.musicSelection();
            break;
            case 'Music': this.filesSelection();
            break;
        }
    }

    photosSelection = () => {
        this.changeOptions('Pictures');
    }
    videosSelection = () => {
        this.changeOptions('Movies');
    }
    musicSelection = () => {
        this.changeOptions('Documents');
    }
    filesSelection = () => {
        this.changeOptions('Music');
    }

    showModalView = () => {
        if(this.state.showModal) {
            return(
                <View style = { [ styles.backgroundWrapper ] }>
                    <View style = { [ styles.backgroundWrapper, styles.dimBlack ] } />
                    <View style = { styles.modalContainer }>
                        <View style = { styles.modalTitleContainer }>
                            <Text style = { styles.titleLightBoldText }>What do you want to sync?</Text>
                        </View>
                        {
                            this.state.options.map(option => {
                                return (
                                    <TouchableOpacity 
                                        key = { option.type }
                                        style = { styles.modalCheckListItemContainer } 
                                        onPress = { () => { this.getCallback(option.type); } } >
                                        <View style = { styles.flexRow }>
                                            <Image style = { styles.selectedIcon }
                                                source = {
                                                    option.isSelected ? 
                                                    require('../images/Icons/ListItemSelected.png') :
                                                    require('../images/Icons/ListItemUnselected.png') } />
                                            <Text style = { styles.label }>{ option.title }</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        }
                        <TouchableOpacity style = { styles.goButton } onPress = { this.closeModal }>
                            <Text style = { styles.syncMyDeviceText }>Go</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <View style = { styles.contentContainer }>
                    <View style = { styles.titleContainer }>
                        <Text style = { styles.titleText }>Let’s get started!</Text>
                    </View>
                    <View style = { styles.titleLightContainer }>
                        <Text style = { styles.titleLightRegularText }>You have 
                            <Text style = { styles.titleLightBoldText }> 25GB of free storage</Text>
                        </Text>
                    </View>
                    <View style = { styles.cetralImageContainer }>
                        <Image style = { styles.imageContainer } source = { require('../images/MainScreen/Folder.png') } resizeMode = 'contain' ></Image>
                    </View>
                    <View style = { styles.aditionalTextContainer }>
                        <Text style = { styles.titleLightRegularText }>Automatically sync your
                            <Text style = { styles.titleLightBoldText }> photos, videos,</Text>
                        </Text>
                        <View style = { styles.flexRow }>
                            <Text style = { styles.titleLightBoldText }>music</Text>
                            <Text style = { styles.titleLightRegularText }> or</Text>
                            <Text style = { styles.titleLightBoldText }> files</Text>
                            <Text style = { styles.titleLightRegularText }> or add them manually.</Text> 
                        </View>
                    </View>
                    <TouchableOpacity style = { styles.syncMyDeviceButton } onPressOut = { this.showModal }>
                        <Text style = { styles.syncMyDeviceText }>Sync my files</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.showModalView()
                } 
            </View>
        );
    }
}

FirstSignInComponent.propTypes = {
    createBucket: PropTypes.func
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainer: {
        paddingHorizontal: getWidth(20)
    },
    titleContainer: {
        marginTop: getHeight(15),
    },
    titleText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(28),
        alignSelf:'flex-start',
        color: '#384B65'
    },
    titleLightContainer: {
        marginTop: getHeight(19)
    },
    titleLightRegularText: {
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        color: '#384B65'
    },
    titleLightBoldText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(16),
        color: '#384B65'
    },
    flexRow: {
        flexDirection: 'row'
    },
    cetralImageContainer: {
        marginTop: getHeight(38),
        marginLeft: getWidth(-20),
        height: getHeight(250),
        width: getDeviceWidth(),
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: {
        height: getHeight(250)
    },
    syncMyDeviceButton: {
        marginTop: getHeight(85),
        width: getWidth(335),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2794FF',
        borderRadius: getWidth(6)
    },
    syncMyDeviceText: {
        fontFamily: 'montserrat_bold',
        fontSize: getHeight(16),
        color: 'white'
    },
    backgroundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.3
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        marginTop: getHeight(215),
        alignSelf: 'center',
        height: getHeight(350),
        width: getWidth(355),
        borderRadius: 6
    },
    modalTitleContainer: {
        height: getHeight(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalCheckListItemContainer: {
        height: getHeight(55),
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    selectedIcon: {
        width: getWidth(22),
        height: getWidth(22),
        marginLeft: getWidth(20)
    },
    label: {
        marginLeft: getWidth(15),
        fontFamily: 'montserrat_regular',
        fontSize: getHeight(16),
        color: '#2794FF'
    },
    underline: {
        height: getHeight(0.5),
        backgroundColor: '#a6b5ca',
        width: getWidth(315),
        opacity: 0.2,
        alignSelf: 'center'
    },
    goButton: {
        marginTop: getHeight(20),
        width: getWidth(335),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2794FF',
        borderRadius: getWidth(6),
        alignSelf: 'center'
    },
    aditionalTextContainer: {
        marginTop: getHeight(64)
    }
});