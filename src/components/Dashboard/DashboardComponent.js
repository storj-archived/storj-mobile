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

        console.log(this.props);

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
                    isFilesScreen = { this.props.isFilesScreen}
                    files = { this.props.files }
                    buckets = { this.props.buckets }
                    openBucket = { this.props.openBucket}
                    screenName = { this.props.screenName }
                    selectItem = { this.props.selectBucket }
                    showOptions = { this.props.showOptions }
                    navigateBack = { this.props.navigateBack }
                    deselectItem = { this.props.deselectBucket }      
                    isSelectionMode = { this.props.isSelectionMode }
                    selectedBucketId = { this.props.selectedBucketId }
                    animatedScrollValue = { this.animatedScrollValue  }
                    selectedFilesCount = { this.props.selectedFilesCount }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    selectedBucketsCount = { this.props.selectedBucketsCount }  
                    onSingleItemSelected = { this.props.onSingleItemSelected }  
                    isSingleItemSelected = { this.props.isSingleItemSelected }
                    navigateToDashboardFilesScreen = { this.props.navigateToDashboardFilesScreen } />
            </View>
        )
    }
}

DashboardComponent.propTypes = {
    showOptions: PropTypes.func,
    files: PropTypes.array,
    buckets: PropTypes.array,
    openBucket: PropTypes.func,
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