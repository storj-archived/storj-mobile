import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BucketsScreenHeaderComponent from '../../components/BucketsScreenHeaderComponent';
import DashboardScreenNavigation from '../../containers/DashboardScreenNavContainer';
import { getWidth, getHeight } from '../../utils/adaptive';

export default class DashboardComponent extends Component {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <DashboardScreenNavigation
                    setSelectionId = { this.props.setSelectionId }
                    defaultRoute = { this.props.defaultRoute }
                    animatedScrollValue = { this.animatedScrollValue } />
                <BucketsScreenHeaderComponent
                    setDashboardBucketId = { this.props.setDashboardBucketId }
                    isFilesScreen = { this.props.isFilesScreen }
                    buckets = { this.props.buckets }
                    screenName = { this.props.screenName }
                    selectItem = { this.props.selectItem }
                    showOptions = { this.props.showOptions }
                    navigateBack = { this.props.navigateBack }
                    deselectItem = { this.props.deselectItem }     
                    isSelectionMode = { this.props.isSelectionMode }
                    openedBucketId = { this.props.selectedBucketId }
                    animatedScrollValue = { this.animatedScrollValue }
                    enableSelectionMode = { this.props.enableSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    selectedItemsCount = { this.props.selectedItemsCount }  
                    onSingleItemSelected = { this.props.onSingleItemSelected }  
                    isSingleItemSelected = { this.props.isSingleItemSelected } />
            </View>
        )
    }
}

DashboardComponent.propTypes = {
    showOptions: PropTypes.func,
    files: PropTypes.array,
    buckets: PropTypes.array,    
    screenName: PropTypes.string,
    selectItem: PropTypes.func,
    navigateBack: PropTypes.func,
    deselectItem: PropTypes.func,
    isSelectionMode: PropTypes.bool,
    selectedBucketId: PropTypes.string,
    animatedScrollValue: PropTypes.number,
    selectedFilesCount: PropTypes.number,
    disableSelectionMode: PropTypes.func,
    selectedBucketsCount: PropTypes.number,
    onSingleItemSelected: PropTypes.func,
    isSingleItemSelected: PropTypes.bool,
    navigateToFilesScreen: PropTypes.func,
    defaultRoute: PropTypes.string,
    animatedScrollValue: PropTypes.number
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});