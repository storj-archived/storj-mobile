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
                <View>
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
        marginTop: getHeight(25),
        marginRight: getWidth(5),
        justifyContent: 'center',
        alignContent: 'center'
    },
    expanderTextView: {
        height: getHeight(55),
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    expanderText: {
        marginTop: getHeight(30),        
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(14),
        color: 'rgba(56, 75, 101, 0.4)'
    },
    expanderImage: {
        width: getWidth(10),
        height: getHeight(5),
    },
    collapseImage: {
        width: getWidth(5),
        height: getHeight(10),
    },
    expanderContainer: {
        marginHorizontal: getWidth(20)
    },
    expanderBorder: {
        borderBottomWidth: getHeight(0.5),
        borderColor: 'rgba(56, 75, 101, 0.2)'
    }
});