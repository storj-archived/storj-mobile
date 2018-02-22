import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import React, { Component } from 'react';
import BucketsScreenHeaderComponent from '../components/BucketsScreenHeaderComponent';
import DashboardScreenNavigation from '../containers/DashboardScreenNavContainer';

export default class DashboardComponent extends Component {
    constructor(props) {
        super(props);

        this.animatedScrollValue = new Animated.Value(0);
    }

    render() {
        return(
            <View style={ styles.mainContainer }>
                <DashboardScreenNavigation
                    animatedScrollValue = { this.animatedScrollValue } />
                <BucketsScreenHeaderComponent
                    files = { this.props.files }
                    buckets = { this.props.buckets }
                    openBucket = { this.props.openBucket}
                    screenName = { this.props.screenName }
                    selectItem = { this.props.selectBucket }
                    navigateBack = { this.props.navigateBack }
                    deselectItem = { this.props.deselectBucket }      
                    isSelectionMode = { this.props.isSelectionMode }
                    selectedBucketId = { this.props.selectedBucketId }
                    animatedScrollValue = { this.animatedScrollValue  }
                    selectedFilesCount = { this.props.selectedFilesCount }
                    selectedItemsCount = { this.props.selectedItemsCount }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    selectedBucketsCount = { this.props.selectedBucketsCount }  
                    onSingleItemSelected = { this.props.onSingleItemSelected }  
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    navigateToFilesScreen = { this.props.navigateToFilesScreen } />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});