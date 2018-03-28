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
import BucketsScreenHeaderComponent from '../../components/BucketsScreenHeaderComponent';
import ListComponent from '../../components/ListComponent';
import ListItemModel from '../../models/ListItemModel';
import BucketModel from '../../models/BucketModel';
import DashboardListFooterComponent from '../../components/Dashboard/DashboardListFooterComponent';
import DashboardListHeaderComponent from '../../components/Dashboard/DashboardListHeaderComponent';
import { getHeight, getWidth } from '../../utils/adaptive';

export default class DashboardListComponent extends Component{
    constructor(props) {
        super(props);        
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
                            listComponent('Favourite buckets', starredBuckets.slice(0, 3), this.props, starredBucketsCount, true)
                        }
                        {
                            listComponent('Favourite files', starredFiles.slice(0, 3), this.props, starredFilesCount, false)
                        }
                        {
                            listComponent('Recent sync', syncedFiles.slice(0, 3), this.props, syncedfilesCount, false)
                        }     
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const listComponent = (title, data, props, count, isBucket) => {
    
    return(
        <View>  
            <DashboardListHeaderComponent
                onPress = { () => {} }
                title = { title } />
            <ListComponent
                setSelectionId = { props.setSelectionId }
                selectedItemId = { props.selectedItemId }
                verticalPaddingDisabled = { true }
                isExpanderDisabled = { true }
                openBucket = { props.openBucket }
                navigateToDashboardFilesScreen = { props.navigateToDashboardFilesScreen }
                onSingleItemSelected = { props.onSingleItemSelected }                    
                animatedScrollValue = { props.animatedScrollValue }
                enableSelectionMode = { props.enableSelectionMode }
                disableSelectionMode = { props.disableSelectionMode }
                isSelectionMode = { props.isSelectionMode }
                isSingleItemSelected = { props.isSingleItemSelected }
                listItemIcon = { isBucket ? require('../../images/Icons/BucketListItemIcon.png') : require('../../images/Icons/FileListItemIcon.png') }
                starredListItemIcon = { isBucket ? require('../../images/Icons/ListStarredBucket.png') : require('../../images/Icons/ListStarredFile.png') }
                deselectItem = { props.deselectItem }
                navigateToFilesScreen = { props.navigateToFilesScreen ? props.navigateToFilesScreen : () => {} }
                selectItem = { props.selectItem }
                data = { data } />
            <DashboardListFooterComponent
                count = { count } 
                onPress = { () => {} } />
        </View>
    )
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
        height: getHeight(24), 
        width: getWidth(24)
    },
    contentWrapper: {
        paddingBottom: getHeight(60)
    }
});
