import {
    View,
    Text
} from 'react-native';
import React, { Component } from 'react';
import ListComponent from '../../components/ListComponent';
import DashboardListFooterComponent from '../../components/Dashboard/DashboardListFooterComponent';
import DashboardListHeaderComponent from '../../components/Dashboard/DashboardListHeaderComponent';
import PropTypes from 'prop-types';
import BaseListComponent from '../BaseListComponent';

export default class DashboardItemListComponent extends BaseListComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>  
                <DashboardListHeaderComponent
                    onPress = { () => { this.props.navigationPress(this.props.itemType) } }
                    title = { this.props.title } />
                <this.ListComponent
                    textComp = { (props) => <Text numberOfLines = { 1 } style = { props.style }>{ this.props.getBucketName(props.children) }</Text> }
                    listItemIcon = { this.props.listItemIcon }
                    cloudListItemIcon = { this.props.cloudListItemIcon }
                    />
                <DashboardListFooterComponent
                    count = { this.props.count } 
                    onPress = { () => { this.props.navigationPress(this.props.itemType) } } />
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
    storageAmount: PropTypes.string
}
