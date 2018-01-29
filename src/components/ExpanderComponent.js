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
        return (
            <View style = { styles.expanderContainer }>
                <View style = { styles.expanderTextView }>
                    <Text style = { styles.expanderText }> { this.props.propName } </Text>
                    <TouchableOpacity 
                        onPress = { () => { this.setState({ isExpanded: !this.state.isExpanded }); }}>
                            <Image 
                                source = { this.state.isExpanded ? require('../images/Icons/expandList.png') : require('../images/Icons/collapsList.png') } 
                                style = { this.state.isExpanded ? styles.expanderImage : styles.collapseImage } />
                    </TouchableOpacity>
                </View>
                { 
                    (() => {
                        if(this.state.isExpanded) {
                            return this.props.listItems;
                        }
                    })()
                }
            </View>)
    };
}

ExpanderComponent.propTypes = {
    listItems: PropTypes.array,
    propName: PropTypes.string
};

const styles = StyleSheet.create({
    expanderTextView: {
        height: getHeight(44),
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    expanderText: {
        marginVertical: getHeight(15),        
        fontFamily: 'Montserrat-Regular',
        lineHeight: getHeight(17),
        fontSize: getHeight(14),
        color: 'black'
    },
    expanderImage: {
        marginVertical: getHeight(17),
        width: getHeight(10),
        height: getHeight(10)
    },
    collapseImage: {
        marginTop: getHeight(18),
        marginBottom: getHeight(18),
        width: getHeight(10),
        height: getHeight(10)
    },
    expanderContainer: {
        marginHorizontal: getWidth(20),
        borderBottomWidth: getHeight(1),
        borderColor: 'gray'
    }
});