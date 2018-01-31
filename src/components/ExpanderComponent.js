import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { getWidth, getHeight } from '../utils/adaptive';

/**
 * Custom Expander component, used in main page
 */
export default class ExpanderComponent extends Component {
    constructor(props) {
        super(props); 

        this.state = {
            isExpanded: true
        };
    };

    render() {        
        var expanderContainerStyle = this.state.isExpanded ? styles.expanderContainer : [styles.expanderContainer, styles.expanderBorder];
        return (
            <TouchableOpacity style = { expanderContainerStyle } onPress = { () => { this.setState({ isExpanded: !this.state.isExpanded }); }}>
                <View style = { styles.expanderTextView }>
                    <Text style = { styles.expanderText }> { this.props.propName } </Text>
                    <View style = { styles.imageWrapper }>
                        <Image 
                            source = { this.state.isExpanded ? require('../images/Icons/expandList.png') : require('../images/Icons/collapsList.png') } 
                            style = { this.state.isExpanded ? styles.expanderImage : styles.collapseImage } />
                    </View>
                </View>
                <View style = { styles.contentWrapper }>
                { 
                    (() => {
                        if(this.state.isExpanded) {
                            return this.props.listItems;
                        }
                    })()
                }
                </View>
            </TouchableOpacity>)
    };
}

ExpanderComponent.propTypes = {
    listItems: PropTypes.array,
    propName: PropTypes.string
};

const styles = StyleSheet.create({
    imageWrapper: {
        marginVertical: getHeight(8),
        marginRight: getWidth(5),
        justifyContent: 'center',
        alignContent: 'center'
    },
    expanderTextView: {
        height: getHeight(44),
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    expanderText: {
        marginVertical: getHeight(13),        
        fontFamily: 'Montserrat-Regular',
        lineHeight: getHeight(18),
        fontSize: getHeight(14),
        color: 'rgba(56, 75, 101, 0.4)'
    },
    expanderImage: {
        width: getWidth(15),
        height: getHeight(10),
    },
    collapseImage: {
        width: getWidth(10),
        height: getHeight(12),
    },
    expanderContainer: {
        marginHorizontal: getWidth(10)
    },
    contentWrapper: {
        /* alignItems: 'center' */
    },
    expanderBorder: {
        borderBottomWidth: getHeight(0.5),
        borderColor: 'rgba(56, 75, 101, 0.4)'
    }
});