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

export default class BucketsScreenHeaderComponent extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return(
            <View style={ styles.mainContainer }>
                <AnimatedHeader 
                   isSelectionMode = { this.props.isSelectionMode }
                   disableSelectionMode = { this.props.disableSelectionMode }
                   buckets = { this.props.buckets }
                   flex = { this.props.headerFlex } 
                   selectedBucketsCount = { this.props.selectedBucketsCount } />
            </View>
        );
    };
}

class AnimatedHeader extends Component {
    constructor(props) {
        super(props);

        this.flex = new Animated.Value(props.flex);
    }

    animateTo(value) {
        Animated.timing(this.flex, {
            toValue: value
        }).start();
    };

    render() {
        return(
            <Animated.View style={ [ styles.headerContainer, { flex: this.flex } ] }>
                {
                    this.props.isSelectionMode ? 
                        <View style = { styles.selectionWrapper }>
                            <Text style = { styles.selectionText }>{ this.props.selectedBucketsCount + " selected" }</Text>
                            <Text
                                style = { styles.textDone } 
                                onPress = { this.props.disableSelectionMode }>Done</Text>
                        </View> : 
                        <View style = { styles.searchWrapper }>
                            <TouchableOpacity>
                                <Image style = { styles.backButton } source = { require("../images/Icons/BackButton.png") } />
                            </TouchableOpacity>
                            <SearchComponent />
                        </View>
                }
            </Animated.View>
        );
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0
    },
    headerContainer: {
        backgroundColor: 'white',
        padding: 10
    },
    backButton: {
        height: getHeight(16),
        width: getWidth(16)
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
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
    }
});

//TODO: Add prop types