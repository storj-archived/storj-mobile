import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import { getHeight } from '../../utils/adaptive';
import PropTypes from 'prop-types';

/**
 * Styled checkbox component
 */
export default class CheckboxComponent extends Component {
    constructor(props) {
        super(props);

        const isBoolean = typeof(props.isChecked) === 'boolean';

        this.state = {
            isChecked: props.isChecked && isBoolean ? props.isChecked : false 
        };

        this.onPress = this.onPress.bind(this);
    };

    /**
    * Fires on cheched\unchecked
    */
    onPress() {
        let newState = !this.state.isChecked;

        this.setState({isChecked: newState});
        this.props.onPress(newState);
    };

    render() {
        return(
            <TouchableOpacity style = { styles.checkboxWrapper } onPress = { this.onPress }>
                <View style = { this.state.isChecked ? styles.checked : null }/>
            </TouchableOpacity>
        );
    };
}

CheckboxComponent.propTypes = {
    onPress: PropTypes.func,
    isChecked: PropTypes.bool
};

const styles = StyleSheet.create({
    checkboxWrapper: {
        height: getHeight(24),
        width: getHeight(24),
        backgroundColor: 'transparent',
        borderWidth: getHeight(1),
        borderRadius: getHeight(5),
        borderColor: '#2684FF',
        padding: getHeight(2)
    },
    checked: {
        flex: 1,
        backgroundColor: '#2782ff',
        borderRadius: getHeight(5),
    }
});