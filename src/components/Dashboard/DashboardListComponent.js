import {
    View,
    Text,
    Animated,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../../components/ListComponent';
import ListItemModel from '../../models/ListItemModel';
import BucketModel from '../../models/BucketModel';
import DashboardListFooterComponent from '../../components/Dashboard/DashboardListFooterComponent';
import DashboardListHeaderComponent from '../../components/Dashboard/DashboardListHeaderComponent';
import { getHeight, getWidth } from '../../utils/adaptive';
import PropTypes from 'prop-types';
import { TYPES } from '../../utils/constants/typesConstants';

export default class DashboardListComponent extends Component{
    constructor(props) {
        super(props);     
    }

    getThreeLast(array) {
        let length = array.length >= 3 ? array.length - 3 : 0;
        return array.slice(length).reverse();
    }

    render() {
        let props = this.props;
        let starredBuckets = props.buckets.filter(item => item.getStarred());
        let starredBucketsCount = starredBuckets.length;

        let starredFiles = props.files.filter(item => item.getStarred());
        let starredFilesCount = starredFiles.length;

        let syncedFiles = props.files.filter(item => item.getSynced());
        let syncedfilesCount = syncedFiles.length;

        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.scrollViewContainer }>
                    <ScrollView showsVerticalScrollIndicator = { false } decelerationRate = { 'normal' }>
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
                                            <Text style = { styles.buttonTextBold }>{ this.props.storageAmount }{ ' GB' }</Text>
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
                                            <Text style = { styles.buttonTextBold }>{ this.props.bandwidthAmount }{ ' GB' }</Text>
                                        </View>
                                        <Image 
                                            style = { styles.expandImage } 
                                            source = { require('../../images/DashboardScreen/Vector.png') } 
                                            resizeMode = 'contain' />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style = { styles.contentWrapper }>
                        {
                            starredBucketsCount + starredFilesCount + syncedfilesCount === 0 
                            ? <View style = { styles.emptyStateContainer }>
                                <View style = { styles.explanationTextContainer }>
                                    <Text style = { styles.explanationTextBold }>Nothing to show yet.</Text>
                                    <Text style = { styles.explanationTextRegular }>Your favourite items and recent sync will be show here.</Text>
                                </View>
                                <View style = { styles.imageContainer }>
                                    <Image
                                        resizeMode = 'contain'
                                        source = { require('../../images/MainScreen/Folder.png') }
                                        style = { styles.image } />
                                </View>
                            </View>
                            : null
                        }
                        {
                            listComponent(
                                'Favourite buckets', 
                                this.getThreeLast(starredBuckets), 
                                this.props, 
                                starredBucketsCount, 
                                true, 
                                this.props.activeScreen,
                                TYPES.BUCKETS,
                                this.props.redirectToFavoriteBucketsScreen
                            )
                        }
                        {
                            listComponent(
                                'Favourite files',
                                this.getThreeLast(starredFiles), 
                                this.props, 
                                starredFilesCount, 
                                false, 
                                this.props.activeScreen,
                                TYPES.FILES,
                                this.props.redirectToFavoriteFilesScreen
                            )
                        }
                        {
                            listComponent(
                                'Recent sync', 
                                this.getThreeLast(syncedFiles), 
                                this.props, 
                                syncedfilesCount, 
                                false, 
                                this.props.activeScreen,
                                TYPES.SYNCED,
                                this.props.redirectToFavoriteFilesScreen
                            )
                        }     
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const listComponent = (title, data, props, count, isBucket, screen, itemType, navigationAction) => {
    if(data.length === 0) return null;

        return(
            <View>  
                <DashboardListHeaderComponent
                    onPress = { () => { navigationAction(itemType) } }
                    title = { title } />
                <ListComponent
                    activeScreen = { screen }
                    screens = { "DashboardScreen" }                
                    setSelectionId = { () => {} }
                    selectedItemId = { null }
                    verticalPaddingDisabled = { true }
                    isExpanderDisabled = { true }
                    openBucket = { props.setDashboardBucketId }
                    navigateToDashboardFilesScreen = { props.navigateToDashboardFilesScreen }
                    onSingleItemSelected = { () => {} }
                    animatedScrollValue = { props.animatedScrollValue }
                    enableSelectionMode = { () => {} }
                    disableSelectionMode = { () => {} }
                    isSelectionMode = { false }
                    isSingleItemSelected = { false }
                    listItemIcon = { isBucket ? require('../../images/Icons/BucketListItemIcon.png') : require('../../images/Icons/FileListItemIcon.png') }
                    starredListItemIcon = { isBucket ? require('../../images/Icons/ListStarredBucket.png') : require('../../images/Icons/ListStarredFile.png') }
                    deselectItem = { () => {} }
                    navigateToFilesScreen = { props.navigateToFilesScreen ? props.navigateToFilesScreen : () => {} }
                    selectItem = { () => {} }
                    data = { data } />
                <DashboardListFooterComponent
                    count = { count } 
                    onPress = { () => { navigationAction(itemType) } } />
            </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#FFFFFF'
    },
    scrollViewContainer: { 
        marginTop: getHeight(20), 
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
        height: getHeight(24), 
        width: getWidth(24)
    },
    contentWrapper: {
        paddingBottom: getHeight(60)
    },
    explanationTextContainer: { 
        marginTop: getHeight(30),
        marginLeft: getWidth(10),
        alignItems: 'flex-start',
        height: getHeight(70),
        width: getWidth(320)
    },
    explanationTextRegular: { 
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(16), 
        color: '#384B65' 
    },
    explanationTextBold: { 
        fontFamily: 'Montserrat-Bold', 
        fontSize: getHeight(16), 
        color: '#384B65' 
    },
    imageContainer: {
        marginTop: getHeight(28),
        alignItems: 'center',
        justifyContent: 'center'
    }, 
    image: {
        height: getHeight(250)
    },
    emptyStateContainer: {
        flex: 1
    }
});

DashboardListComponent.propTypes = {
    animatedScrollValue: PropTypes.object,
    bandwidthAmount: PropTypes.string,
    buckets: PropTypes.array,
    deselectItem: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    enableSelectionMode: PropTypes.func,
    files: PropTypes.array,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    navigateBack: PropTypes.func,
    navigateToDashboardFilesScreen: PropTypes.func,
    onSingleItemSelected: PropTypes.func,
    setDashboardBucketId: PropTypes.func,
    dashboardBucketId: PropTypes.string,    
    selectItem: PropTypes.func,
    selectedItemId: PropTypes.string,
    setSelectionId: PropTypes.func,
    storageAmount: PropTypes.string
}
