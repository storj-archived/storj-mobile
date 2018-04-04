import {
    View,
    Text,
    StyleSheet,
    Animated,
    Image,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import SearchComponent from '../components/SearchComponent';
import { getWidth, getHeight } from '../utils/adaptive';
import PropTypes from 'prop-types';

export default class BucketsScreenHeaderComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style = { styles.mainContainer }>
                <AnimatedHeader
                    isFilesScreen = { this.props.isFilesScreen } 
                    selectedItemsCount = { this.props.selectedItemsCount }
                    showOptions = { this.props.showOptions }
                    buckets = { this.props.buckets }
                    openedBucketId = { this.props.openedBucketId }
                    navigateBack = { this.props.navigateBack }
                    isSelectionMode = { this.props.isSelectionMode }
                    disableSelectionMode = { this.props.disableSelectionMode }
                    animatedScrollValue = { this.props.animatedScrollValue } />
            </View>
        );
    }
}

function rotateTransform(xOffset) {
    
    let searchX = xOffset.interpolate({
		inputRange: [
			0, 
            180,
            181
		],
		outputRange: [1, 1.03, 1.03]
    });

    let searchY = xOffset.interpolate({
		inputRange: [
			0, 
            180,
            181
		],
		outputRange: [1, 0.92, 0.92]
    });

    let searchMoveY = xOffset.interpolate({
		inputRange: [
			0, 
            180,
            181
		],
		outputRange: [1, -5, -5]
    });
    
    let mainContainerMoveY = xOffset.interpolate({
		inputRange: [
			0, 
            180,
            181
		],
		outputRange: [0, -20, -20]
    });

    let selectY = xOffset.interpolate({
		inputRange: [
			0, 
            180,
            181
		],
		outputRange: [0, 20, 20]
    });
    
    let color = xOffset.interpolate({
		inputRange: [
			0, 
            180,
            181
		],
		outputRange: ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)']
	});

    return [
        {
            transform: [
                { translateY: mainContainerMoveY }
            ]
        },
        {
            transform: [                
            ]
        },
        {
            transform: [
                { translateY: selectY }
            ]
        }
    ];
}

class AnimatedHeader extends Component {
    constructor(props) {
        super(props);
    }

    renderSearchComponent(res) {
        return(
            <View style = { [ styles.searchWrapper ] }>
                <Animated.View style = { [ styles.searchWrapperInner, res[1] ] }>
                    <SearchComponent
                        isFilesScreen = { this.props.isFilesScreen }
                        showOptions = { this.props.showOptions }
                        buckets = { this.props.buckets }
                        openedBucketId = { this.props.openedBucketId }
                        styleContainer = { styles.searchComponent }
                        navigateBack = { this.props.navigateBack } />
                </Animated.View>
            </View>
        );
    }

    renderSelectComponent(res) {      
        let count = this.props.selectedItemsCount;
        return(
            <View style = { styles.selectionContainer }>
                <Animated.View style = { [ styles.selectionWrapper, res[2] ] }>
                    <Text style = { styles.selectionText }>{ count + " selected" }</Text>
                    <Text
                        style = { styles.textDone } 
                        onPress = { this.props.disableSelectionMode }>Done</Text>
                </Animated.View>
            </View>
        );
    }

    render() {
        const selectionMode = this.props.isSelectionMode ? null: styles.justifyContentFlexEnd;
        const transformArr = rotateTransform(this.props.animatedScrollValue);

        return(
            <Animated.View style={ [ styles.headerContainer, selectionMode, transformArr[0] ] }>
                {
                    this.props.isSelectionMode ? this.renderSelectComponent(transformArr) : this.renderSearchComponent(transformArr)
                }
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        position: 'absolute',
        height: getHeight(80),
        top: 0,
        right: 0,
        left: 0
    },
    headerContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        borderBottomWidth: 0,
        paddingBottom: getHeight(10),
        borderColor: 'gray'
    },
    justifyContentFlexEnd: {
        justifyContent: 'flex-end'
    },
    backButton: {
        height: getHeight(16),
        width: getWidth(16)
    },
    backButtonWrapper: {
        padding: getWidth(20)
    },
    searchWrapper: {
        paddingHorizontal: getWidth(6),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchWrapperInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.97
    },
    selectionContainer: {
        flex: 1
    },
    selectionWrapper: {
        paddingHorizontal: getWidth(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectionText: {
        fontSize: getHeight(30), 
        color: '#384B65',
        fontFamily: 'Montserrat-Bold'
    },
    textDone: {
        fontSize: getHeight(18),
        color: '#2794FF',
        fontFamily: 'Montserrat-Medium'
    },
    searchComponent: {
        paddingVertical: getHeight(10),
        flex: 1
    }
});

BucketsScreenHeaderComponent.propTypes = {
    animatedScrollValue: PropTypes.object,
    buckets: PropTypes.array,
    disableSelectionMode: PropTypes.func,
    isFilesScreen: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    navigateBack: PropTypes.func,
    openedBucketId: PropTypes.string,
    selectedItemsCount: PropTypes.number,
    showOptions: PropTypes.func
};
