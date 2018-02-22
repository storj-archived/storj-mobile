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
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import ListComponent from '../components/ListComponent';
import ListItemModel from '../models/ListItemModel';
import BucketModel from '../models/BucketModel';
import { getHeight, getWidth } from '../utils/adaptive';

export default class DashboardListComponent extends Component{
    constructor(props) {
        super(props);

        this.data = this.getTestListItems();
    }

    //TODO: delete after getting actual data
    getTestListItems() {
        let data = [new ListItemModel(
                        new BucketModel( 
                            {isDecrypted: true, 
                            hash: 1343708071, 
                            created: new Date().getDate(), 
                            name: "name1", 
                            id: "98eb1da07f47de06c6612999"}), 
                        false, 
                        false),
                    new ListItemModel(
                        new BucketModel( 
                            {isDecrypted: true, 
                            hash: 1333708071, 
                            created: new Date().getDate(), 
                            name: "name2", 
                            id: "98eb1da07f47de06c6612991"}), 
                        false, 
                        false),
                    new ListItemModel(
                        new BucketModel( 
                            {isDecrypted: true, 
                            hash: 1243708071, 
                            created: new Date(), 
                            name: "name3", 
                            id: "98eb1da07f47de06c6612929"}), 
                        false, 
                        false),
        ];
        return data;
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <View style = { styles.scrollViewContainer }>
                    <ScrollView showsVerticalScrollIndicator = { false } >
                        <View style = { styles.topButtonsContainer }>
                            <TouchableOpacity onPress = { () => {} } >
                                <View style = { styles.button }>
                                    <View style = { styles.buttonContentContainer }>
                                        <Image 
                                            style = { styles.buttonImage } 
                                            source = { require('../images/DashboardScreen/Storage.png') } 
                                            resizeMode = 'contain' />
                                        <View >
                                            <Text style = { styles.buttonTextRegular }>Storage</Text>
                                            <Text style = { styles.buttonTextBold }>{ this.props.storageAmount ? this.props.storageAmount : '00.00' }{ ' GB' }</Text>
                                        </View>
                                        <Image 
                                            style = { styles.expandImage } 
                                            source = { require('../images/DashboardScreen/Vector.png') } 
                                            resizeMode = 'contain' />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress = { () => {} } >
                                <View style = { styles.button }>
                                    <View style = { styles.buttonContentContainer }>
                                        <Image 
                                            style = { styles.buttonImage } 
                                            source = { require('../images/DashboardScreen/Bandwidth.png') } 
                                            resizeMode = 'contain' />
                                        <View >
                                            <Text style = { styles.buttonTextRegular }>Bandwidth</Text>
                                            <Text style = { styles.buttonTextBold }>{ this.props.bandwidthAmount ? this.props.bandwidthAmount : '0.00' }{ ' GB' }</Text>
                                        </View>
                                        <Image 
                                            style = { styles.expandImage } 
                                            source = { require('../images/DashboardScreen/Vector.png') } 
                                            resizeMode = 'contain' />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            listComponent('Favourites', this.data, this.props)
                        }
                        {
                            listComponent('Recent sync', this.data, this.props)
                        }     
                        {
                            listComponent('Trash', this.data, this.props)
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const listComponent = (title, data, props) => {

    function onPress(params) {
        props.openBucket(params.bucketId);
        props.navigateToFilesScreen(params.bucketId);    
    }
    
    return(
        <View>  
            {
                titleLink(title)
            }
            <ListComponent
                verticalPaddingDisabled = { true }
                isExpanderDisabled = { true }
                onPress = { (params) => { onPress(params); } } 
                onSingleItemSelected = { props.onSingleItemSelected }                    
                animatedScrollValue = { props.animatedScrollValue }
                enableSelectionMode = { props.enableSelectionMode }
                disableSelectionMode = { props.disableSelectionMode }
                isSelectionMode = { props.isSelectionMode }
                isSingleItemSelected = { props.isSingleItemSelected }
                listItemIcon = { require('../images/Icons/BucketListItemIcon.png') }
                deselectItem = { props.deselectItem }
                navigateToFilesScreen = { props.navigateToFilesScreen ? props.navigateToFilesScreen : () => {} }
                selectItem = { props.selectItem }
                data = { data } />
            {
                footerLink()
            }
        </View>
    )
}

const footerLink = () => {
    return(
        <TouchableOpacity onPress = { () => {} }>
            <View style = { footerLinkStyles.container }>
                <View style = { footerLinkStyles.contentContainer }>
                    <Text style = { footerLinkStyles.titleText }>2 more...</Text>
                    <View style = { footerLinkStyles.flexRow } >
                        <Image 
                            style = { footerLinkStyles.expandImage } 
                            source = { require('../images/DashboardScreen/BlueVector.png') } 
                            resizeMode = 'contain' />
                    </View>
                </View>
            </View>
            <View style = { footerLinkStyles.underLine }></View>
        </TouchableOpacity>
    )
}

const titleLink = (title) => {
    let routeName;

    switch (title) {
        case 'Favourites': routeName = "FavouritesScreen";
        break;
        case 'Recent sync': routeName = "RecentScreen";
        break;
        case 'Trash': routeName = "TrashScreen";
        break;
        default: routeName = null;
    }

    return(
        <TouchableOpacity onPress = { () => {} }>
            <View style = { titleLinkStyles.container }>
                <View style = { titleLinkStyles.contentContainer }>
                    <Text style = { titleLinkStyles.titleText }>{title}</Text>
                    <View style = { titleLinkStyles.flexRow } >
                        <Text style = { titleLinkStyles.linkText } >View all</Text>
                        <Image 
                            style = { titleLinkStyles.expandImage } 
                            source = { require('../images/DashboardScreen/BlueVector.png') } 
                            resizeMode = 'contain' />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#FFFFFF'
    },
    scrollViewContainer: { 
        marginTop: getHeight(80), 
        marginHorizontal: getWidth(20) 
    },
    topButtonsContainer: { 
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

const titleLinkStyles = StyleSheet.create({
    container: {
        height: getHeight(54)
    },
    contentContainer: { 
        marginTop: getHeight(20), 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(14), 
        color: 'rgba(56, 75, 101, 0.4)'
    },
    linkText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: getHeight(12), 
        color: '#2794FF'
    },
    expandImage: {
        height: getHeight(12), 
        width: getWidth(7), 
        marginLeft: getWidth(10)
    }
});

const footerLinkStyles = StyleSheet.create({
    container: {
        height: getHeight(54)
    },
    contentContainer: { 
        marginTop: getHeight(20), 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16), 
        color: '#2794FF'
    },
    expandImage: {
        height: getHeight(12), 
        width: getWidth(7), 
        marginLeft: getWidth(10)
    },
    underLine: { 
        height: 1, 
        backgroundColor: 'rgba(56, 75, 101, 0.2)' 
    }
})