import {
    View,
    Text
} from 'react-native';
import React from 'react';
import DashboardListFooterComponent from '../../components/Dashboard/DashboardListFooterComponent';
import DashboardListHeaderComponent from '../../components/Dashboard/DashboardListHeaderComponent';
import PropTypes from 'prop-types';
import BaseListComponent from '../Lists/BaseListComponent';

export default class DashboardItemListComponent extends BaseListComponent {
    constructor(props) {
        super(props);

        this.navigationPress = this.navigationPress.bind(this);
    }

    navigationPress() {
        this.props.navigationPress(this.props.itemType);
    }

    render() {
        return(
            <View>  
                <DashboardListHeaderComponent
                    onPress = { this.navigationPress }
                    title = { this.props.title } />
                <this.ListComponent
                    textComp = { (props) => <Text numberOfLines = { 1 } style = { props.style }>{ this.props.getBucketName(props.children) }</Text> }
                    listItemIcon = { this.props.listItemIcon }
                    cloudListItemIcon = { this.props.cloudListItemIcon } />
                <DashboardListFooterComponent
                    count = { this.props.count } 
                    onPress = { this.navigationPress } />
            </View>
        )
    }
}

DashboardItemListComponent.propTypes = {
    animatedScrollValue: PropTypes.object,
    bandwidthAmount: PropTypes.string,
    buckets: PropTypes.array,
    files: PropTypes.array,
    navigateToDashboardFilesScreen: PropTypes.func,
    setDashboardBucketId: PropTypes.func,  
    storageAmount: PropTypes.string,
    cloudListItemIcon: PropTypes.number,
    count: PropTypes.number,
    data: PropTypes.array,
    getBucketName: PropTypes.func,
    getItemSize: PropTypes.func,
    isExpanderDisabled: PropTypes.bool,
    isGridViewShown: PropTypes.bool,
    isListActionsDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    itemType: PropTypes.string,
    listItemIcon: PropTypes.number,
    navigationPress: PropTypes.func,
    onCancelPress: PropTypes.func,
    onDotsPress: PropTypes.func,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
    onRefresh: PropTypes.func,
    props: PropTypes.object,
    title: PropTypes.string
}
