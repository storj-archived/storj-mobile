import {
    View,
    StyleSheet,
    Text,
    ActivityIndicator
} from 'react-native';
import React from 'react';
import { getHeight } from '../utils/adaptive';
import BaseListComponent from "../components/BaseListComponent";
import EmpyBucketComponent from '../components/EmpyBucketComponent';
import PropTypes from 'prop-types';

export default class FilesListComponent extends BaseListComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const isGridView = this.props.isGridViewShown;
        let isEmpty = this.props.data.length === 0 && !this.props.isLoading;

        return(
            isEmpty
                ? <View style = { styles.mainContainer } key = { 'empty' }><EmpyBucketComponent/></View>
                : <View style = { styles.mainContainer } key = { 'notempty' }>
                    <this.ListComponent
                        textComp = { textComp.bind(this) }
                        listItemIcon = { require('../images/Icons/FileListItemIcon.png') }
                        starredListItemIcon = { isGridView ? require('../images/Icons/GridStarredFile.png') : require('../images/Icons/ListStarredFile.png') }
                        contentWrapperStyle = { styles.contentWrapper } />
                    { 
                        this.props.isLoading ? <LoadingComponent isLoading = { this.props.isLoading } /> : null 
                        /* TODO: Check bug with activity indicator */ 
                    }
                </View>                       
        );
    }
}

function textComp (props) {
    return (
        <Text numberOfLines = {1} style = { props.style }>{ this.props.getFileName(props.children).name }
            <Text style = { styles.extentionText }>{ this.props.getFileName(props.children).extention }</Text> 
        </Text>
    );
};

const LoadingComponent = (props) => (
    <View style = { styles.loadingComponentContainer }>
        <ActivityIndicator animating = { props.isLoading ? true : false } size = { 'large' } color = { 'blue' } />
    </View>
); 

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentWrapper: {
        paddingTop: getHeight(58),
        paddingBottom: getHeight(60)
    },
    loadingComponentContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: getHeight(80),
        height: getHeight(60)
    },
    extentionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16),
        color: 'rgba(56, 75, 101, 0.4)'
    }
});

FilesListComponent.propTypes = {
    activeScreen: PropTypes.string,
    animatedScrollValue: PropTypes.object,
    bucketId: PropTypes.string,
    cancelDownload: PropTypes.func,
    cancelUpload: PropTypes.func,
    data: PropTypes.array,
    deselectFile: PropTypes.func,
    disableSelectionMode: PropTypes.func,
    enableSelectionMode: PropTypes.func,
    isGridViewShown: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,
    onPress: PropTypes.func, 
    renewFileList: PropTypes.func,
    selectFile: PropTypes.func,
    selectedItemId: PropTypes.string,
    setSelectionId: PropTypes.func
};