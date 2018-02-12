import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainNavigationContainer from '../containers/MainNavigationContainer';
import ActionBarComponent from '../components/ActionBarComponent';
import CreateBucketPopUpComponent from '../components/InputPopUpComponent';
import { getWidth, getHeight, getDeviceWidth } from '../utils/adaptive';
import StorjLib from '../utils/StorjModule';

export default class FirstSignInComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            androidOptions: [
                { type: 'photos', isSelected: false, title: 'My photos' },
                { type: 'videos', isSelected: false, title: 'My videos' },
                { type: 'music', isSelected: false, title: 'My music' },
                { type: 'files', isSelected: false, title: 'Files' }
            ],
            showModal: false
        }
    }

    showModal = () => {
        this.setState({ showModal: true });
    }

    closeModal = async () => {
        this.setState({ 
            showModal: false,
            photosSelected: true,
            videosSelected: true,
            musicSelected: true,
            filesSelected: true 
        });

        this.state.androidOptions.forEach(option => {
            if (option.isSelected) {
                this.props.createBucket(option.type);
            }
        });
    }

    changeOptions = (type) => {
        let oldValues = this.state.androidOptions;
        
        this.setState({ androidOptions: oldValues.map(value => {
            if(value.type === type) value.isSelected = !value.isSelected;
            return value;
        })});
    }

    getCallback = (type) => {
        switch(type) {
            case 'photos': this.photosSelection();
            break;
            case 'videos': this.videosSelection();
            break;
            case 'music': this.musicSelection();
            break;
            case 'files': this.filesSelection();
            break;
        }
    }

    photosSelection = () => {
        this.changeOptions('photos');
    }
    videosSelection = () => {
        this.changeOptions('videos');
    }
    musicSelection = () => {
        this.changeOptions('music');
    }
    filesSelection = () => {
        this.changeOptions('files');
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
                            this.state.androidOptions.map(option => {
                                console.log(option);
                                return (
                                    <TouchableOpacity style = { styles.modalCheckListItemContainer } onPress = { () => { this.getCallback(option.type); } } >
                                    <View style = { styles.flexRow }>
                                        <Image style = { styles.selectedIcon }
                                            source = {
                                                option.isSelected ? 
                                                require('../images/Icons/ListItemSelected.png') :
                                                require('../images/Icons/ListItemUnselected.png') } />
                                        <Text style = { styles.label }>{ option.title }</Text>
                                    </View>
                                </TouchableOpacity>);
                            })
                        }
                        <TouchableOpacity style = { styles.goButton } onPress = { this.closeModal.bind(this) }>
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
                        <Text style = { styles.titleText }>Your storage is empty</Text>
                    </View>
                    <View style = { styles.titleLightContainer }>
                        <Text style = { styles.titleLightRegularText }>Start with syncing
                            <Text style = { styles.titleLightBoldText }> photos, videos,</Text>
                        </Text>
                        <View style = { styles.flexRow }>
                            <Text style = { styles.titleLightBoldText }>music</Text>
                            <Text style = { styles.titleLightRegularText }> or</Text>
                            <Text style = { styles.titleLightBoldText }> files</Text>
                            <Text style = { styles.titleLightRegularText }> on your device</Text> 
                        </View>
                    </View>
                    <View >
                        <Image style = { styles.imageContainer } source = { require('../images/MainScreen/Folder.png') } resizeMode = 'contain' ></Image>
                    </View>
                    <TouchableOpacity style = { styles.syncMyDeviceButton } onPressOut = { this.showModal.bind(this) }>
                        <Text style = { styles.syncMyDeviceText }>Sync my device</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.showModalView()
                } 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainer: {
        marginLeft: getWidth(20)
    },
    titleContainer: {
        marginTop: getHeight(15),
    },
    titleText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(28),
        alignSelf:'flex-start',
        color: '#384B65'
    },
    titleLightContainer: {
        marginTop: getHeight(9)
    },
    titleLightRegularText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16),
        color: '#384B65'
    },
    titleLightBoldText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: getHeight(16),
        color: '#384B65'
    },
    flexRow: {
        flexDirection: 'row'
    },
    imageContainer: {
        marginTop: getHeight(79),
        marginLeft: getWidth(-20),
        height: getHeight(250),
        width: getDeviceWidth(),
        alignSelf: 'center'
    },
    syncMyDeviceButton: {
        marginTop: getHeight(76),
        width: getWidth(335),
        height: getHeight(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2794FF',
        borderRadius: getWidth(6)
    },
    syncMyDeviceText: {
        fontFamily: 'Montserrat-Bold',
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
        fontFamily: 'Montserrat-Regular',
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
    }
});