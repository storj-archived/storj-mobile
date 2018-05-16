import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Image
} from 'react-native';
import React, { Component } from 'react';
import { getHeight, getWidth } from '../../utils/adaptive';
import PropTypes from 'prop-types';
import { TYPES } from '../../utils/constants/typesConstants';
import DashboardItemListComponent from './DashboardItemListComponent';
import { getShortBucketName } from "../../utils/fileUtils";
import { InfoButtonComponent } from '../InfoButtonComponent';

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
                            <InfoButtonComponent 
                                imagePath = { require('../../images/DashboardScreen/Storage.png') }
                                title = { 'Storage' }
                                amount = { this.props.storageAmount  } />
                            <InfoButtonComponent 
                                imagePath = { require('../../images/DashboardScreen/Bandwidth.png') }
                                title = { 'Bandwidth' }
                                amount = { this.props.bandwidthAmount } />
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

const listComponent = (title, data, props, count, itemType, navigationPress) => {
    if(data.length === 0) return null;
        let animatedScrollValue = new Animated.Value(0);

        const onPress = (item) => {
            if(!item.entity.bucketId) {
                props.setDashboardBucketId(item.getId());
                props.navigateToDashboardFilesScreen();
                return;
            }

            props.setDashboardBucketId(item.entity.bucketId);
            props.navigateToDashboardFilesScreen();
        }

        return(
            <DashboardItemListComponent 
                animatedScrollValue = { animatedScrollValue }
                title = { title }
                count = { count }
                itemType = { itemType }
                navigationPress = { navigationPress }
                props = { props }
                getItemSize = { () => {} }
                isLoading = { false }
                searchSubSequence = { null }
                sortingMode = { null }
                onRefresh = { () => {} }
                isGridViewShown = { false }
                onPress = { onPress }
                isExpanderDisabled = { true }
                onLongPress = { () => {} }
                onDotsPress = { () => {} }
                onCancelPress = { () => {} }
                selectedItemId = { null }
                isSelectionMode = { false }
                listItemIcon = { itemType === TYPES.BUCKETS ? require('../../images/Icons/BucketListItemIcon.png') : require('../../images/Icons/FileListItemIcon.png')  }
                cloudListItemIcon = { itemType === TYPES.BUCKETS ? require('../../images/Icons/CloudBucket.png') : require('../../images/Icons/CloudFile.png') }
                data = { data }
                getBucketName = { getShortBucketName } />
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
    },
    buttonTextContainer: {
        marginLeft: getWidth(15)
    }
});

DashboardListComponent.propTypes = {
    animatedScrollValue: PropTypes.object,
    bandwidthAmount: PropTypes.string,
    buckets: PropTypes.array,
    files: PropTypes.array,
    navigateToDashboardFilesScreen: PropTypes.func,
    setDashboardBucketId: PropTypes.func,  
    storageAmount: PropTypes.string
}
