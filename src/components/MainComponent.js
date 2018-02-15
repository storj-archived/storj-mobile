import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainNavigationContainer from '../containers/MainNavigationContainer';
import ActionBarComponent from '../components/ActionBarComponent';
import CreateBucketPopUpComponent from '../components/InputPopUpComponent';

export default class MainComponent extends Component {
    constructor(props) {
        super(props);
    };
    
    render() {
        return(
            <View style={ styles.mainContainer }>
                <View style = { styles.navigationContainer }>
                    <MainNavigationContainer
                        isSingleItemSelected = { this.props.isSingleItemSelected }
                        isActionBarShown = { this.props.isActionBarShown }
                        isSelectionMode = { this.props.isSelectionMode }
                        onActionBarPress = { () => { this.props.onActionBarPress(); } } />
                </View>
                {
                    this.props.isActionBarShown || this.props.isSelectionMode ? 
                        <ActionBarComponent
                            bucketScreenRouteName = { this.props.bucketScreenRouteName }
                            openedBucketId = { this.props.openedBucketId }
                            isSingleItemSelected = { this.props.isSingleItemSelected }
                            isSelectionMode = { this.props.isSelectionMode }
                            selectionModeActions = { this.props.selectionModeActions }
                            openedBucketActions = { this.props.openedBucketActions }
                            tapBarActions = { this.props.tapBarActions } /> : null
                }
                {
                    this.props.isCreateBucketInputShown ? 
                        <View style = { styles.popUpBackgroundtWrapper }>
                            <View style={ [ styles.popUpBackgroundtWrapper, styles.dimBlack ] } />
                            <CreateBucketPopUpComponent 
                                onCancel = { () => { this.props.hideCreateBucketInput(); } }
                                onApply = { (bucketName) => { 
                                    this.props.createBucket(bucketName);
                                    this.props.hideCreateBucketInput(); 
                                }} />
                        </View> : null
                }
                {
                    this.props.isLoading ?
                        <View style = { [ styles.backgroundWrapper ] }>
                            <View style = { [ styles.backgroundWrapper, styles.dimBlack ] } />
                            <View style = { [ styles.backgroundWrapper, styles.setChildCenter ] }>
                                <ActivityIndicator animating = { true } color = { "#2782ff" } size = { "large" }/>
                            </View>
                        </View> : null
                }
            </View>
        );
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    navigationContainer: {
        flex: 1
    },
    backgroundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.3
    },
    popUpBackgroundtWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    setChildCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
});

//TODO: Add prop types
/* MainComponent.PropTypes = {

}; */